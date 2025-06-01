import { NextResponse } from 'next/server';
import { getYouTubeVideos, refreshYouTubeCacheInBackground } from '../../../../lib/youtube-cache';

// This route handler will use the cached YouTube video data
// and trigger a background refresh of the cache if needed

export async function GET(request: Request) {
  console.log('YouTube API endpoint called');
  
  try {
    // Check if we should force a refresh
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Get videos from cache or API with fallback mechanism
    const videos = await getYouTubeVideos(forceRefresh);
    
    // If not already forcing a refresh, trigger a background refresh of the cache if it's older than 1 hour
    // This won't block the response and will update the cache for future requests
    if (!forceRefresh) {
      refreshYouTubeCacheInBackground().catch(console.error);
    }
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Unhandled error in YouTube API route:', error);
    
    // Last resort fallback - return empty array with error status
    return NextResponse.json([], { status: 500 });
  }
}