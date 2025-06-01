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

    // Check if we're using the new structure (individual files) or the old structure
    const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    // Generate a slug for the video
    const generateSlug = (videoId: string) => {
      return `video-${videoId}`;
    };
    
    // Check if the video already exists in either structure
    let videoExists = false;
    
    // If using the new structure with individual files
    if (existsSync(indexPath) && existsSync(videosDir)) {
      // Read the index file
      const indexContent = await fs.readFile(indexPath, 'utf8');
      const { data: indexData, content: indexContentText } = matter(indexContent);
      
      if (!Array.isArray(indexData.videos)) {
        indexData.videos = [];
      }
      
      // Check if the video already exists in the index
      // Use a synchronous check first with the available data
      videoExists = indexData.videos.some((video: any) => {
        if (!video.slug) return false;
        return false; // We'll do a more thorough check below
      });
      
      // If not found in the quick check, do a more thorough check of all video files
      if (!videoExists) {
        // Check each video file manually
        for (const video of indexData.videos) {
          if (!video.slug) continue;
          
          const videoPath = path.join(videosDir, `${video.slug}.md`);
          if (existsSync(videoPath)) {
            try {
              const videoContent = await fs.readFile(videoPath, 'utf8');
              const { data: videoData } = matter(videoContent);
              const existingVideoId = extractVideoId(videoData.url);
              if (existingVideoId === videoId) {
                videoExists = true;
                break;
              }
            } catch (err) {
              // Continue checking other videos
            }
          }
        }
      }
      
      if (videoExists) {
        return NextResponse.json(
          { error: 'Video already exists', videoId },
          { status: 409 }
        );
      }
      
      // Create a slug for the new video
      const slug = generateSlug(videoId);
      
      // Add the video to the index
      indexData.videos.push({
        slug,
        category,
        featured
      });
      
      // Write the updated index back to the file
      const updatedIndexContent = matter.stringify(indexContentText, indexData);
      await fs.writeFile(indexPath, updatedIndexContent, 'utf8');
      
      // Create the individual video file
      const videoData = {
        url,
        title: "[Pending YouTube API]",
        description: "[Will be filled by API]",
        category,
        featured
        // Note: We don't include publishedAt and channelName if they're undefined
        // This avoids YAML serialization errors
      };
      
      const videoContent = matter.stringify('', videoData);
      const videoPath = path.join(videosDir, `${slug}.md`);
      await fs.writeFile(videoPath, videoContent, 'utf8');
    }
    // If using the old structure with a single file
    else if (existsSync(oldFilePath)) {
      const fileContent = await fs.readFile(oldFilePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // Check if the video already exists
      const videos = data.videos || [];
      videoExists = videos.some((video: any) => {
        const existingVideoId = extractVideoId(video.url);
        return existingVideoId === videoId;
      });
      
      if (videoExists) {
        return NextResponse.json(
          { error: 'Video already exists', videoId },
          { status: 409 }
        );
      }
      
      // Add the new video
      videos.push({
        url,
        title: "[Pending YouTube API]",
        description: "[Will be filled by API]",
        category,
        featured
      });
      
      // Update the videos data
      data.videos = videos;
      
      // Write the updated content back to the file
      const updatedFileContent = matter.stringify(content, data);
      await fs.writeFile(oldFilePath, updatedFileContent, 'utf8');
    }
    // If neither structure exists, create the new structure
    else {
      // Create videos directory if it doesn't exist
      if (!existsSync(videosDir)) {
        await fs.mkdir(videosDir, { recursive: true });
      }
      
      // Create a slug for the new video
      const slug = generateSlug(videoId);
      
      // Create the index file
      const indexData = {
        videos: [{
          slug,
          category,
          featured
        }]
      };
      
      const indexContent = matter.stringify('', indexData);
      await fs.writeFile(indexPath, indexContent, 'utf8');
      
      // Create the individual video file
      const videoData = {
        url,
        title: "[Pending YouTube API]",
        description: "[Will be filled by API]",
        category,
        featured
        // Note: We don't include publishedAt and channelName if they're undefined
        // This avoids YAML serialization errors
      };
      
      const videoContent = matter.stringify('', videoData);
      const videoPath = path.join(videosDir, `${slug}.md`);
      await fs.writeFile(videoPath, videoContent, 'utf8');
    }
    
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
      message: 'Video added successfully',
      videoId
    });
  } catch (error) {
    console.error('Error adding YouTube video:', error);
    return NextResponse.json(
      { error: 'Failed to add YouTube video' },
      { status: 500 }
    );
  }
}
