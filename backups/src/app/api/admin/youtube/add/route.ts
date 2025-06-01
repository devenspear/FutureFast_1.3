import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Function to extract video ID from YouTube URL (copied from youtube-utils to avoid import issues)
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

export async function POST(request: Request) {
  try {
    // Verify authentication by reading the auth-token cookie
    const authToken = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('auth-token='))?.split('=')[1];
      
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { url, category = 'Interview', featured = false } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Read the existing videos.md file
    const filePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Videos file not found' },
        { status: 500 }
      );
    }

    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Check if the video already exists
    const videos = data.videos || [];
    const videoExists = videos.some((video: { url: string }) => {
      const existingVideoId = extractVideoId(video.url);
      return existingVideoId === videoId;
    });

    if (videoExists) {
      return NextResponse.json(
        { error: 'Video already exists', videoId },
        { status: 409 }
      );
    }

    // Add the new video entry
    videos.push({
      url,
      title: "[Pending YouTube API]",
      description: "[Will be filled by API]",
      category,
      featured,
      publishedAt: undefined,
      channelName: undefined
    });

    // Update the videos data
    data.videos = videos;

    // Write the updated content back to the file
    const updatedFileContent = matter.stringify(content, data);
    await fs.writeFile(filePath, updatedFileContent, 'utf8');

    // Trigger the YouTube API cache refresh (this will update the metadata)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/youtube?refresh=true`, { 
        method: 'GET',
        cache: 'no-store'
      });
    } catch (error) {
      console.error('Error refreshing YouTube cache:', error);
      // Continue even if refresh fails, as the cache will update eventually
    }

    return NextResponse.json({
      success: true,
      message: 'YouTube video added successfully',
      videoId
    });
  } catch (error: unknown) {
    console.error('Error adding YouTube video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
