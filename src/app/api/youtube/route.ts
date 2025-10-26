/**
 * Public YouTube API
 * Returns all published YouTube videos from the database
 *
 * This replaces the old cache-based system and reads directly from Postgres
 */

import { NextResponse } from 'next/server';
import { YouTubeModel } from '@/lib/db/models';

export async function GET(request: Request) {
  console.log('YouTube API endpoint called');

  try {
    // Fetch all published videos from database
    const videos = await YouTubeModel.findAll({
      status: 'published',
      limit: 1000, // Get all published videos
    });

    // Transform to match expected format (for backwards compatibility)
    const videoItems = videos.map((video) => ({
      id: video.video_id,
      videoId: video.video_id,
      title: video.title,
      description: video.description || '',
      url: video.url,
      thumbnailUrl: video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`,
      channel: video.channel || 'YouTube',
      publishedAt: video.published_date?.toISOString() || video.created_at.toISOString(),
      category: video.category || 'Interview',
      featured: video.featured,
      duration: video.duration || 0,
      tags: video.tags || [],
    }));

    return NextResponse.json(videoItems);

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// Optional: Add POST endpoint for future use (e.g., webhooks)
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
