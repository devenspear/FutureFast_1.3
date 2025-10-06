import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GitHubService from '../../../../../../lib/github-service';

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
    hasYouTubeKey: !!process.env.YOUTUBE_API_KEY,
    isProduction: process.env.NODE_ENV === 'production'
  });
  
  try {
    // Parse the request body early for both production and development
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

    // For production (Vercel), use GitHub API to commit files
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 [YouTube Add API] Production environment - using GitHub API');

      const githubService = new GitHubService();

      if (!githubService.isConfigured()) {
        console.error('❌ [YouTube Add API] GitHub service not configured');
        return NextResponse.json({
          error: 'GitHub integration not configured. Please set GITHUB_TOKEN and GITHUB_REPO environment variables.',
        }, { status: 500 });
      }

      // Generate slug for the video
      const slug = `video-${videoId}`;

      // Fetch YouTube metadata if API key is available
      let videoTitle = "[Pending YouTube API]";
      let videoDescription = "[Will be filled by API]";
      let publishedDate = new Date().toISOString().split('T')[0];

      if (process.env.YOUTUBE_API_KEY) {
        try {
          console.log('🎬 [YouTube Add API] Fetching metadata from YouTube API');
          const ytResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
          );

          if (ytResponse.ok) {
            const ytData = await ytResponse.json();
            if (ytData.items && ytData.items[0]) {
              const snippet = ytData.items[0].snippet;
              videoTitle = snippet.title || videoTitle;
              videoDescription = snippet.description || videoDescription;
              publishedDate = snippet.publishedAt?.split('T')[0] || publishedDate;
              console.log(`✅ [YouTube Add API] Fetched metadata: ${videoTitle}`);
            }
          }
        } catch (error) {
          console.warn('⚠️ [YouTube Add API] Failed to fetch YouTube metadata:', error);
          // Continue with placeholder data
        }
      }

      // Create video file content
      const videoData = {
        url,
        title: videoTitle,
        description: videoDescription,
        publishedDate,
        category,
        featured
      };

      const videoContent = matter.stringify('', videoData);
      const videoFilePath = `content/youtube/videos/${slug}.md`;

      // Read current index file from GitHub to check for duplicates and update
      try {
        const { owner, repo, branch } = githubService.getRepoInfo();
        const indexPath = 'content/youtube/index.md';

        // Fetch current index file
        const indexResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${indexPath}?ref=${branch}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        let indexData: any = { videos: [] };
        let indexContentText = '';

        if (indexResponse.ok) {
          const indexFileData = await indexResponse.json();
          const indexContent = Buffer.from(indexFileData.content, 'base64').toString('utf-8');
          const parsed = matter(indexContent);
          indexData = parsed.data;
          indexContentText = parsed.content;

          if (!Array.isArray(indexData.videos)) {
            indexData.videos = [];
          }

          // Check if video already exists
          const videoExists = indexData.videos.some((video: { slug?: string }) => video.slug === slug);
          if (videoExists) {
            return NextResponse.json(
              { error: 'Video already exists', videoId },
              { status: 409 }
            );
          }
        }

        // Add new video to index
        indexData.videos.push({
          slug,
          category,
          featured
        });

        const updatedIndexContent = matter.stringify(indexContentText, indexData);

        // Commit both files to GitHub
        const commitResult = await githubService.commitMultipleFiles(
          [
            { path: videoFilePath, content: videoContent },
            { path: indexPath, content: updatedIndexContent }
          ],
          `Add YouTube video: ${slug}\n\n🤖 Generated with Claude Code\n\nCo-Authored-By: Claude <noreply@anthropic.com>`
        );

        if (!commitResult.success) {
          throw new Error(commitResult.error || 'Failed to commit to GitHub');
        }

        console.log(`✅ [YouTube Add API] Video added successfully via GitHub: ${slug}`);

        // Trigger cache refresh
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'https://future-fast-1-3.vercel.app';
          console.log('🔄 [YouTube Add API] Triggering cache refresh:', `${baseUrl}/api/youtube?refresh=true`);
          await fetch(`${baseUrl}/api/youtube?refresh=true`, {
            method: 'GET',
            cache: 'no-store'
          });
          console.log('✅ [YouTube Add API] Cache refresh completed');
        } catch (error) {
          console.error('⚠️ [YouTube Add API] Error refreshing YouTube API cache:', error);
        }

        return NextResponse.json({
          success: true,
          message: 'Video added successfully and committed to GitHub. Deployment will start automatically.',
          videoId,
          slug,
          commitSha: commitResult.commitSha,
          note: 'The video will appear on the live site after Vercel deployment completes (~1-2 minutes).'
        });

      } catch (githubError) {
        console.error('❌ [YouTube Add API] GitHub operation failed:', githubError);
        return NextResponse.json({
          error: 'Failed to commit to GitHub',
          details: githubError instanceof Error ? githubError.message : 'Unknown error'
        }, { status: 500 });
      }
    }
    
    // Log all request headers for debugging (development only)
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 [YouTube Add API] Request headers:', headers);
    
    // Bypass middleware auth check for now - handle auth directly here
    // Check for either middleware auth or direct Basic Auth
    const isMiddlewareAuth = request.headers.get('x-authenticated') === 'true';
    const authHeader = request.headers.get('authorization');
    const adminCookie = request.headers.get('cookie')?.includes('admin-auth=authenticated');
    
    let isAuthenticated = false;
    
    // Check multiple auth methods
    if (isMiddlewareAuth) {
      console.log('✅ [YouTube Add API] Middleware authentication found');
      isAuthenticated = true;
    } else if (adminCookie) {
      console.log('✅ [YouTube Add API] Cookie authentication found');
      isAuthenticated = true;
    } else if (authHeader?.startsWith('Basic ')) {
      console.log('🔑 [YouTube Add API] Checking direct Basic Auth');
      try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        
        const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
        const expectedPassword = process.env.ADMIN_PASSWORD || 'futurefast2025';
        
        if (username === expectedUsername && password === expectedPassword) {
          console.log('✅ [YouTube Add API] Direct Basic Auth successful');
          isAuthenticated = true;
        }
      } catch (error) {
        console.error('❌ [YouTube Add API] Basic Auth parsing error:', error);
      }
    }
    
    if (!isAuthenticated) {
      console.error('❌ [YouTube Add API] No valid authentication found');
      console.log('🔍 [YouTube Add API] Auth debug:', {
        hasMiddlewareAuth: isMiddlewareAuth,
        hasAuthHeader: !!authHeader,
        hasAdminCookie: adminCookie,
        authHeaderType: authHeader?.substring(0, 10) + '...'
      });
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('✅ [YouTube Add API] Authentication successful');

    // Body and videoId were already parsed and validated at the beginning of the function
    console.log('📦 [YouTube Add API] Request body:', { url, videoId, category, featured });

    console.log('📁 [YouTube Add API] Checking file structure...');
    // Check if we're using the new structure (individual files) or the old structure
    // In production (Vercel), use different base path
    const basePath = process.cwd();
    
    const indexPath = path.join(basePath, 'content/youtube/index.md');
    const videosDir = path.join(basePath, 'content/youtube/videos');
    const oldFilePath = path.join(basePath, 'content/youtube/videos.md');
    
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
