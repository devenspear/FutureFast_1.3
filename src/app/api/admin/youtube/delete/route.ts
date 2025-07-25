import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function POST(request: Request) {
  try {
    // Verify authentication - support both JWT cookie and Basic Auth
    const cookieHeader = request.headers.get('cookie');
    const authHeader = request.headers.get('authorization');
    
    let isAuthenticated = false;
    
    // Check for JWT token in cookies first
    if (cookieHeader) {
      const authToken = cookieHeader.split(';')
        .find(c => c.trim().startsWith('auth-token='))?.split('=')[1];
      
      if (authToken) {
        isAuthenticated = true;
      }
    }
    
    // If no JWT token, check for Basic Auth
    if (!isAuthenticated && authHeader?.startsWith('Basic ')) {
      try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        
        const expectedUsername = process.env.ADMIN_USERNAME;
        const expectedPassword = process.env.ADMIN_PASSWORD;
        
        if (username === expectedUsername && password === expectedPassword) {
          isAuthenticated = true;
        }
      } catch (error) {
        console.error('Basic Auth parsing error:', error);
      }
    }
      
    if (!isAuthenticated) {
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

    // Check if we're using the new structure (individual files) or the old structure
    const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    // If using the new structure with individual files
    if (existsSync(indexPath) && existsSync(videosDir)) {
      // Read the index file
      const indexContent = await fs.readFile(indexPath, 'utf8');
      const { data: indexData, content: indexContentText } = matter(indexContent);
      
      if (!Array.isArray(indexData.videos)) {
        return NextResponse.json(
          { error: 'Invalid index file structure' },
          { status: 500 }
        );
      }
      
      // Find the video to delete
      let videoIndex = -1;
      let videoSlug = '';
      
      if (id.startsWith('pending-')) {
        // For pending videos, use the index from the ID
        const pendingIndex = parseInt(id.split('-')[1]);
        videoIndex = pendingIndex;
        if (videoIndex >= 0 && videoIndex < indexData.videos.length) {
          videoSlug = indexData.videos[videoIndex].slug;
        }
      } else {
        // For real videos, try to find by ID or index
        videoIndex = parseInt(id.replace('video-', ''));
        if (videoIndex >= 0 && videoIndex < indexData.videos.length) {
          videoSlug = indexData.videos[videoIndex].slug;
        }
      }
      
      if (videoIndex === -1 || videoIndex >= indexData.videos.length) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      
      // Remove the video from the index
      indexData.videos.splice(videoIndex, 1);
      
      // Write the updated index back to the file
      const updatedIndexContent = matter.stringify(indexContentText, indexData);
      await fs.writeFile(indexPath, updatedIndexContent, 'utf8');
      
      // Delete the individual video file if it exists
      if (videoSlug) {
        const videoPath = path.join(videosDir, `${videoSlug}.md`);
        if (existsSync(videoPath)) {
          await fs.unlink(videoPath);
        }
      }
    }
    // If using the old structure with a single file
    else if (existsSync(oldFilePath)) {
      const fileContent = await fs.readFile(oldFilePath, 'utf8');
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
      await fs.writeFile(oldFilePath, updatedFileContent, 'utf8');
    } else {
      return NextResponse.json(
        { error: 'No video configuration found' },
        { status: 500 }
      );
    }

    // Trigger the YouTube API cache refresh
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/youtube?refresh=true`, { 
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
