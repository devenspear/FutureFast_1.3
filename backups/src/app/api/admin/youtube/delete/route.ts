import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
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
    
    // Find the video to delete
    let videoIndex = -1;
    
    if (id.startsWith('pending-')) {
      // For pending videos, use the index from the ID
      const pendingIndex = parseInt(id.split('-')[1]);
      videoIndex = pendingIndex;
    } else {
      // For real videos, try to find by ID or index
      videoIndex = parseInt(id.replace('video-', ''));
    }
    
    if (videoIndex === -1 || videoIndex >= videos.length) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Remove the video
    videos.splice(videoIndex, 1);

    // Update the videos data
    data.videos = videos;

    // Write the updated content back to the file
    const updatedFileContent = matter.stringify(content, data);
    await fs.writeFile(filePath, updatedFileContent, 'utf8');

    // Trigger the YouTube API cache refresh
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
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting YouTube video:', error);
    return NextResponse.json(
      { error: 'Failed to delete YouTube video' },
      { status: 500 }
    );
  }
}
