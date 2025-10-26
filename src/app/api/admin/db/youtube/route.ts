/**
 * Admin API - YouTube Videos CRUD
 * POST   /api/admin/db/youtube - Create new video
 * GET    /api/admin/db/youtube - List videos with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { YouTubeModel } from '@/lib/db/models';

// YouTube Data API v3
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * GET - List all YouTube videos with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined;
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || undefined;

    // Fetch videos
    const videos = await YouTubeModel.findAll({
      status,
      featured,
      category,
      limit,
      offset,
      search,
    });

    // Get total count
    const total = await YouTubeModel.count({ status, featured, category });

    return NextResponse.json({
      success: true,
      data: videos,
      total,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new YouTube video with auto-fetched metadata
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { url, category, featured = false, status = 'published' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = YouTubeModel.extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link.' },
        { status: 400 }
      );
    }

    // Check if video already exists
    const existing = await YouTubeModel.findByVideoId(videoId);
    if (existing) {
      return NextResponse.json(
        { error: 'This video has already been added. Please check existing videos.' },
        { status: 409 }
      );
    }

    console.log(`🎥 Processing YouTube video: ${videoId}`);

    // Fetch metadata from YouTube API
    let metadata: any = {
      title: 'YouTube Video',
      description: '',
      channel: 'YouTube',
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: null,
      published_date: null,
    };

    if (YOUTUBE_API_KEY) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const video = data.items[0];
            metadata = {
              title: video.snippet.title,
              description: video.snippet.description,
              channel: video.snippet.channelTitle,
              thumbnail_url: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
              duration: parseDuration(video.contentDetails.duration),
              published_date: video.snippet.publishedAt,
            };
          }
        }
      } catch (error) {
        console.warn('Failed to fetch YouTube metadata, using defaults:', error);
      }
    }

    // Auto-categorize based on title/description if category not provided
    const finalCategory = category || autoCategorizeVideo(metadata.title, metadata.description);

    // Create video in database
    const video = await YouTubeModel.create({
      video_id: videoId,
      url,
      title: metadata.title,
      description: metadata.description,
      channel: metadata.channel,
      thumbnail_url: metadata.thumbnail_url,
      duration: metadata.duration,
      published_date: metadata.published_date,
      category: finalCategory,
      featured,
      status,
      created_by: 'admin',
    });

    console.log(`✅ YouTube video created: ${video.id}`);

    return NextResponse.json({
      success: true,
      message: 'YouTube video added successfully!',
      data: video,
    });

  } catch (error: any) {
    console.error('Error creating YouTube video:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to add video';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Helper: Parse ISO 8601 duration to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Helper: Auto-categorize video based on title and description
 */
function autoCategorizeVideo(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
    return 'AI & Future of Work';
  }
  if (text.includes('web3') || text.includes('blockchain') || text.includes('crypto')) {
    return 'Web3 & Blockchain';
  }
  if (text.includes('robot') || text.includes('automation')) {
    return 'Robotics & Manufacturing';
  }
  if (text.includes('quantum')) {
    return 'Quantum Computing';
  }
  if (text.includes('metaverse') || text.includes('vr') || text.includes('virtual reality')) {
    return 'VR & Metaverse';
  }

  return 'Interview'; // Default category
}
