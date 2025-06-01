import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
    const { url, category, featured, id } = body;

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
    
    // Get the videos array
    const videos = data.videos || [];
    
    // Find the video to update
    const videoIndex = videos.findIndex((video: any, index: number) => {
      // If we're replacing a pending video, we might not have a real ID
      if (id && id.startsWith('pending-')) {
        const pendingIndex = parseInt(id.split('-')[1]);
        return index === pendingIndex;
      }
      
      // Otherwise, try to match by video ID
      const existingVideoId = extractVideoId(video.url);
      return existingVideoId === videoId;
    });

    if (videoIndex === -1) {
      // If not found, add as a new video
      videos.push({
        url,
        title: "[Pending YouTube API]",
        description: "[Will be filled by API]",
        category: category || 'Interview',
        featured: featured || false
      });
    } else {
      // Update the existing video
      videos[videoIndex] = {
        ...videos[videoIndex],
        url,
        category: category || videos[videoIndex].category || 'Interview',
        featured: featured !== undefined ? featured : videos[videoIndex].featured || false,
        // Keep the title and description if they're not pending, otherwise mark as pending
        title: videos[videoIndex].title && !videos[videoIndex].title.includes('[Pending') 
          ? videos[videoIndex].title 
          : "[Pending YouTube API]",
        description: videos[videoIndex].description && !videos[videoIndex].description.includes('[Will be filled') 
          ? videos[videoIndex].description 
          : "[Will be filled by API]",
        // Preserve existing publishedAt and channelName if they exist
        publishedAt: videos[videoIndex].publishedAt || undefined,
        channelName: videos[videoIndex].channelName || undefined
      };
    }

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
      console.error('Error refreshing YouTube API cache:', error);
      // Continue anyway, as this is not critical
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Video updated successfully',
      videoId,
      videoIndex
    });
  } catch (error) {
    console.error('Error updating YouTube video:', error);
    return NextResponse.json(
      { error: 'Failed to update YouTube video' },
      { status: 500 }
    );
  }
}
