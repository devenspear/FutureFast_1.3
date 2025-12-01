import { NextResponse } from 'next/server';
import { YouTubeModel } from '@/lib/db/models';
import { adminMonitor } from '../../../../../../lib/admin-monitoring-service';

// Function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch YouTube metadata from API
async function fetchYouTubeMetadata(videoId: string): Promise<{
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
} | null> {
  if (!process.env.YOUTUBE_API_KEY) {
    console.log('⚠️ [YouTube Add API] No YouTube API key configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error('❌ [YouTube Add API] YouTube API error:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      console.error('❌ [YouTube Add API] Video not found in YouTube API');
      return null;
    }

    const snippet = data.items[0].snippet;
    return {
      title: snippet.title || 'Untitled Video',
      description: snippet.description || '',
      channelTitle: snippet.channelTitle || 'YouTube',
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  } catch (error) {
    console.error('❌ [YouTube Add API] Error fetching YouTube metadata:', error);
    return null;
  }
}

export async function POST(request: Request) {
  const startTime = adminMonitor.startTimer();

  console.log('🎯 [YouTube Add API] Request received');
  console.log('🌍 [YouTube Add API] Environment:', process.env.NODE_ENV);

  // Track workflow steps for debugging
  const workflowSteps: { step: string; status: 'success' | 'error' | 'skipped'; message: string; timestamp: string }[] = [];

  const addStep = (step: string, status: 'success' | 'error' | 'skipped', message: string) => {
    workflowSteps.push({ step, status, message, timestamp: new Date().toISOString() });
    console.log(`${status === 'success' ? '✅' : status === 'error' ? '❌' : '⏭️'} [${step}] ${message}`);
  };

  try {
    // Step 1: Parse request body
    const body = await request.json();
    const { url, category = 'Interview', featured = false } = body;
    addStep('Parse Request', 'success', `URL: ${url}, Category: ${category}, Featured: ${featured}`);

    // Step 2: Validate URL
    if (!url) {
      addStep('Validate URL', 'error', 'YouTube URL is required');
      return NextResponse.json({
        error: 'YouTube URL is required',
        workflowSteps,
      }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      addStep('Validate URL', 'error', 'Invalid YouTube URL format');
      return NextResponse.json({
        error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.',
        workflowSteps,
      }, { status: 400 });
    }
    addStep('Validate URL', 'success', `Video ID extracted: ${videoId}`);

    // Step 3: Check for duplicates
    const existingVideo = await YouTubeModel.findByVideoId(videoId);
    if (existingVideo) {
      if (existingVideo.status === 'archived') {
        // Reactivate archived video
        await YouTubeModel.update(existingVideo.id, { status: 'published' });
        addStep('Check Duplicates', 'success', 'Reactivated previously archived video');

        return NextResponse.json({
          success: true,
          message: 'Video reactivated successfully',
          videoId,
          video: existingVideo,
          workflowSteps,
          reactivated: true,
        });
      }

      addStep('Check Duplicates', 'error', 'Video already exists in database');
      return NextResponse.json({
        error: 'Video already exists',
        videoId,
        existingVideo: {
          title: existingVideo.title,
          category: existingVideo.category,
          addedAt: existingVideo.created_at,
        },
        workflowSteps,
      }, { status: 409 });
    }
    addStep('Check Duplicates', 'success', 'No duplicate found');

    // Step 4: Fetch YouTube metadata
    let metadata = await fetchYouTubeMetadata(videoId);
    if (metadata) {
      addStep('Fetch Metadata', 'success', `Title: ${metadata.title.substring(0, 50)}...`);
    } else {
      addStep('Fetch Metadata', 'skipped', 'Using placeholder metadata (no API key or API error)');
      metadata = {
        title: '[Pending - Metadata fetch failed]',
        description: 'Video metadata could not be fetched. Please update manually.',
        channelTitle: 'YouTube',
        publishedAt: new Date().toISOString(),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    // Step 5: Create video in database
    const videoData = {
      video_id: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: metadata.title,
      description: metadata.description,
      channel: metadata.channelTitle,
      thumbnail_url: metadata.thumbnail,
      published_date: new Date(metadata.publishedAt),
      category,
      featured,
      status: 'published' as const,
      duration: 0,
      created_by: 'admin',
    };

    const createdVideo = await YouTubeModel.create(videoData);
    addStep('Database Insert', 'success', `Created video record with ID: ${createdVideo.id}`);

    // Step 6: Verify video was created
    const verifiedVideo = await YouTubeModel.findByVideoId(videoId);
    if (!verifiedVideo) {
      addStep('Verify Insert', 'error', 'Video not found after creation - database issue');
      return NextResponse.json({
        error: 'Video creation could not be verified',
        workflowSteps,
      }, { status: 500 });
    }
    addStep('Verify Insert', 'success', 'Video verified in database');

    // Log successful operation
    adminMonitor.log({
      operation: 'video_add',
      status: 'success',
      metadata: {
        videoId,
        title: metadata.title,
        category,
        featured,
        databaseId: createdVideo.id,
      },
      duration: startTime()
    });

    console.log('🎉 [YouTube Add API] Video added successfully:', videoId);

    return NextResponse.json({
      success: true,
      message: 'Video added successfully! It is now live on the website.',
      videoId,
      video: {
        id: createdVideo.id,
        videoId: createdVideo.video_id,
        title: createdVideo.title,
        category: createdVideo.category,
        featured: createdVideo.featured,
        thumbnail: createdVideo.thumbnail_url,
        url: createdVideo.url,
        createdAt: createdVideo.created_at,
      },
      workflowSteps,
      // No deployment needed - video is immediately live
      deploymentRequired: false,
    });

  } catch (error) {
    console.error('💥 [YouTube Add API] Unexpected error:', error);

    addStep('Unexpected Error', 'error', error instanceof Error ? error.message : 'Unknown error');

    // Log error
    adminMonitor.log({
      operation: 'video_add',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: startTime()
    });

    return NextResponse.json({
      error: 'Failed to add YouTube video',
      details: error instanceof Error ? error.message : 'Unknown error',
      workflowSteps,
    }, { status: 500 });
  }
}
