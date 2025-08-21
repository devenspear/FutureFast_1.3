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
  console.log('🎯 [YouTube Add API] Request received');
  console.log('🌍 [YouTube Add API] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    hasYouTubeKey: !!process.env.YOUTUBE_API_KEY
  });
  
  try {
    // Log all request headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 [YouTube Add API] Request headers:', headers);
    
    // Authentication is now handled by middleware
    // The middleware sets 'x-authenticated' header if auth is successful
    const isAuthenticated = request.headers.get('x-authenticated') === 'true';
    
    console.log('🔑 [YouTube Add API] Authentication status:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
    
    // Double-check authentication (middleware should have already handled this)
    if (!isAuthenticated) {
      console.error('❌ [YouTube Add API] Request not authenticated by middleware');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('✅ [YouTube Add API] Authentication verified');

    // Parse the request body
    const body = await request.json();
    console.log('📦 [YouTube Add API] Request body:', body);
    const { url, category = 'Interview', featured = false } = body;

    if (!url) {
      console.error('❌ [YouTube Add API] Missing URL in request');
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [YouTube Add API] Processing URL:', url);

    // Validate YouTube URL
    const videoId = extractVideoId(url);
    console.log('🆔 [YouTube Add API] Extracted video ID:', videoId);
    if (!videoId) {
      console.error('❌ [YouTube Add API] Invalid YouTube URL');
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    console.log('📁 [YouTube Add API] Checking file structure...');
    // Check if we're using the new structure (individual files) or the old structure
    const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    console.log('📁 [YouTube Add API] Paths:', {
      indexPath: existsSync(indexPath),
      videosDir: existsSync(videosDir),
      oldFilePath: existsSync(oldFilePath)
    });
    
    // Generate a slug for the video
    const generateSlug = (videoId: string) => {
      return `video-${videoId}`;
    };
    
    // Check if the video already exists in either structure
    let videoExists = false;
    
    // If using the new structure with individual files
    if (existsSync(indexPath) && existsSync(videosDir)) {
      console.log('📁 [YouTube Add API] Using new structure (individual files)');
      try {
        // Read the index file
        const indexContent = await fs.readFile(indexPath, 'utf8');
        const { data: indexData, content: indexContentText } = matter(indexContent);
        
        if (!Array.isArray(indexData.videos)) {
          indexData.videos = [];
        }
        
        console.log('📊 [YouTube Add API] Current video count:', indexData.videos.length);
        
        // Check if the video already exists in the index
        // Use a synchronous check first with the available data
        videoExists = indexData.videos.some((video: { slug?: string }) => {
          if (!video.slug) return false;
          return false; // We'll do a more thorough check below
        });
        
        // If not found in the quick check, do a more thorough check of all video files
        if (!videoExists) {
          console.log('🔍 [YouTube Add API] Checking existing videos for duplicates...');
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
                  console.log('🔍 [YouTube Add API] Found duplicate video:', video.slug);
                  break;
                }
              } catch (fileError) {
                console.error('⚠️ [YouTube Add API] Error reading video file:', video.slug, fileError);
                // Continue checking other videos
              }
            }
          }
        }
        
        if (videoExists) {
          console.log('❌ [YouTube Add API] Video already exists');
          return NextResponse.json(
            { error: 'Video already exists', videoId },
            { status: 409 }
          );
        }
        
        // Create a slug for the new video
        const slug = generateSlug(videoId);
        console.log('🏷️ [YouTube Add API] Generated slug:', slug);
        
        // Add the video to the index
        indexData.videos.push({
          slug,
          category,
          featured
        });
        
        console.log('💾 [YouTube Add API] Writing updated index file...');
        // Write the updated index back to the file
        const updatedIndexContent = matter.stringify(indexContentText, indexData);
        await fs.writeFile(indexPath, updatedIndexContent, 'utf8');
        
        console.log('💾 [YouTube Add API] Creating individual video file...');
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
        console.log('✅ [YouTube Add API] Video file created successfully');
      } catch (fileError) {
        console.error('💥 [YouTube Add API] File operation error in new structure:', fileError);
        throw new Error(`File system error: ${fileError instanceof Error ? fileError.message : 'Unknown file error'}`);
      }
    }
    // If using the old structure with a single file
    else if (existsSync(oldFilePath)) {
      const fileContent = await fs.readFile(oldFilePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // Check if the video already exists
      const videos = data.videos || [];
      videoExists = videos.some((video: { url: string }) => {
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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      console.log('🔄 [YouTube Add API] Triggering cache refresh:', `${baseUrl}/api/youtube?refresh=true`);
      await fetch(`${baseUrl}/api/youtube?refresh=true`, { 
        method: 'GET',
        cache: 'no-store'
      });
      console.log('✅ [YouTube Add API] Cache refresh completed');
    } catch (error) {
      console.error('⚠️ [YouTube Add API] Error refreshing YouTube API cache:', error);
      // Continue anyway, as this is not critical
    }
    
    const successResponse = { 
      success: true, 
      message: 'Video added successfully',
      videoId
    };
    console.log('🎉 [YouTube Add API] Returning success response:', successResponse);
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('💥 [YouTube Add API] Unexpected error:', error);
    console.error('💥 [YouTube Add API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return more detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = {
      error: 'Failed to add YouTube video',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    };
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}
