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

    // Check if we're using the new structure (individual files) or the old structure
    const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    // Generate a slug for a new video
    const generateSlug = (videoId: string) => {
      return `video-${videoId}`;
    };
    
    // If using the new structure with individual files
    if (existsSync(indexPath) && existsSync(videosDir)) {
      // Read the index file
      const indexContent = await fs.readFile(indexPath, 'utf8');
      const { data: indexData, content: indexContentText } = matter(indexContent);
      
      if (!Array.isArray(indexData.videos)) {
        indexData.videos = [];
      }
      
      // Find the video to update in the index
      let videoIndex = -1;
      let videoSlug = '';
      
      if (id && id.startsWith('pending-')) {
        // For pending videos, use the index from the ID
        const pendingIndex = parseInt(id.split('-')[1]);
        if (pendingIndex >= 0 && pendingIndex < indexData.videos.length) {
          videoIndex = pendingIndex;
          videoSlug = indexData.videos[videoIndex].slug;
        }
      } else {
        // For real videos, search through all video files to find a match
        for (let i = 0; i < indexData.videos.length; i++) {
          const video = indexData.videos[i];
          if (!video.slug) continue;
          
          const videoPath = path.join(videosDir, `${video.slug}.md`);
          if (existsSync(videoPath)) {
            try {
              const videoContent = await fs.readFile(videoPath, 'utf8');
              const { data: videoData } = matter(videoContent);
              const existingVideoId = extractVideoId(videoData.url);
              if (existingVideoId === videoId) {
                videoIndex = i;
                videoSlug = video.slug;
                break;
              }
            } catch (_) {
              // Continue checking other videos
            }
          }
        }
      }
      
      if (videoIndex === -1) {
        // If not found, add as a new video
        const slug = generateSlug(videoId);
        
        // Add to index
        indexData.videos.push({
          slug,
          category: category || 'Interview',
          featured: featured || false
        });
        
        // Write the updated index
        const updatedIndexContent = matter.stringify(indexContentText, indexData);
        await fs.writeFile(indexPath, updatedIndexContent, 'utf8');
        
        // Create the individual video file
        const videoData = {
          url,
          title: "[Pending YouTube API]",
          description: "[Will be filled by API]",
          category: category || 'Interview',
          featured: featured || false
          // Note: We don't include publishedAt and channelName if they're undefined
          // This avoids YAML serialization errors
        };
        
        const videoContent = matter.stringify('', videoData);
        const videoPath = path.join(videosDir, `${slug}.md`);
        await fs.writeFile(videoPath, videoContent, 'utf8');
      } else {
        // Update the existing video in the index
        indexData.videos[videoIndex] = {
          ...indexData.videos[videoIndex],
          category: category || indexData.videos[videoIndex].category || 'Interview',
          featured: featured !== undefined ? featured : indexData.videos[videoIndex].featured || false,
        };
        
        // Write the updated index
        const updatedIndexContent = matter.stringify(indexContentText, indexData);
        await fs.writeFile(indexPath, updatedIndexContent, 'utf8');
        
        // Update the individual video file
        const videoPath = path.join(videosDir, `${videoSlug}.md`);
        if (existsSync(videoPath)) {
          const videoContent = await fs.readFile(videoPath, 'utf8');
          const { data: videoData, content: videoContentText } = matter(videoContent);
          
          // Define the type for the video data with optional properties
          interface VideoData {
            url: string;
            category: string;
            featured: boolean;
            title: string;
            description: string;
            publishedAt?: string;
            channelName?: string;
          }
          
          // Update the video data
          const updatedVideoData: VideoData = {
            ...videoData,
            url,
            category: category || videoData.category || 'Interview',
            featured: featured !== undefined ? featured : videoData.featured || false,
            // Keep the title and description if they're not pending, otherwise mark as pending
            title: videoData.title && !videoData.title.includes('[Pending') 
              ? videoData.title 
              : "[Pending YouTube API]",
            description: videoData.description && !videoData.description.includes('[Will be filled') 
              ? videoData.description 
              : "[Will be filled by API]"
          };
          
          // Preserve existing publishedAt and channelName if they exist
          if (videoData.publishedAt) {
            updatedVideoData.publishedAt = videoData.publishedAt;
          }
          
          if (videoData.channelName) {
            updatedVideoData.channelName = videoData.channelName;
          }
          
          // Write the updated video file
          const updatedVideoContent = matter.stringify(videoContentText, updatedVideoData);
          await fs.writeFile(videoPath, updatedVideoContent, 'utf8');
        }
      }
    }
    // If using the old structure with a single file
    else if (existsSync(oldFilePath)) {
      const fileContent = await fs.readFile(oldFilePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // Get the videos array
      const videos = data.videos || [];
      
      // Find the video to update
      const videoIndex = videos.findIndex((video: { url: string }, index: number) => {
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
            : "[Will be filled by API]"
        };
        
        // Preserve existing publishedAt and channelName if they exist
        if (videos[videoIndex].publishedAt) {
          videos[videoIndex].publishedAt = videos[videoIndex].publishedAt;
        }
        
        if (videos[videoIndex].channelName) {
          videos[videoIndex].channelName = videos[videoIndex].channelName;
        }
      }

      // Update the videos data
      data.videos = videos;

      // Write the updated content back to the file
      const updatedFileContent = matter.stringify(content, data);
      await fs.writeFile(oldFilePath, updatedFileContent, 'utf8');
    } else {
      // If neither structure exists, create the new structure
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
          category: category || 'Interview',
          featured: featured || false
        }]
      };
      
      const indexContent = matter.stringify('', indexData);
      await fs.writeFile(indexPath, indexContent, 'utf8');
      
      // Create the individual video file
      const videoData = {
        url,
        title: "[Pending YouTube API]",
        description: "[Will be filled by API]",
        category: category || 'Interview',
        featured: featured || false
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
      message: 'Video updated successfully',
      videoId
    });
  } catch (error) {
    console.error('Error updating YouTube video:', error);
    return NextResponse.json(
      { error: 'Failed to update YouTube video' },
      { status: 500 }
    );
  }
}
