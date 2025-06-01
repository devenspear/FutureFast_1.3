'use server';

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { loadYouTubeVideos } from './content-loader';

// Define the YouTube video data interface
export interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  url: string;
  category?: string;
  featured?: boolean;
}

// Cache configuration
const CACHE_FILE_PATH = path.join(process.cwd(), '.youtube-cache.json');
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// In-memory cache
let memoryCache: {
  videos: YouTubeVideoData[];
  timestamp: number;
} | null = null;

// Function to extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
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

// Simple fallback method using only oEmbed (fast, no scraping)
async function getVideoInfoFallback(videoId: string): Promise<{ title: string; channelTitle: string } | null> {
  try {
    // Use YouTube oEmbed API which doesn't require authentication and is fast
    const oEmbedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: AbortSignal.timeout(3000) } // 3 second timeout
    );
    
    if (oEmbedResponse.ok) {
      const oEmbedData = await oEmbedResponse.json();
      return {
        title: oEmbedData.title || 'Video Title',
        channelTitle: oEmbedData.author_name || 'YouTube Channel'
      };
    }
  } catch {
    console.log('oEmbed fallback failed for video:', videoId);
  }
  
  return null;
}

// Read cache from file
async function readCacheFile(): Promise<{ videos: YouTubeVideoData[]; timestamp: number } | null> {
  try {
    if (!existsSync(CACHE_FILE_PATH)) {
      return null;
    }
    
    const cacheData = await fs.readFile(CACHE_FILE_PATH, 'utf8');
    return JSON.parse(cacheData);
  } catch (error) {
    console.error('Error reading YouTube cache file:', error);
    return null;
  }
}

// Write cache to file
async function writeCacheFile(videos: YouTubeVideoData[]): Promise<void> {
  try {
    const cacheData = {
      videos,
      timestamp: Date.now()
    };
    
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2), 'utf8');
    console.log('YouTube cache file updated');
  } catch (error) {
    console.error('Error writing YouTube cache file:', error);
  }
}

// Check if cache is valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

// Generate fallback data
async function generateFallbackData(videoConfigs: any[]): Promise<YouTubeVideoData[]> {
  console.log('Using fallback data generation');
  const fallbackData: YouTubeVideoData[] = [];
  
  for (let i = 0; i < videoConfigs.length; i++) {
    const config = videoConfigs[i];
    const videoId = extractVideoId(config.url);
    
    if (!videoId) {
      console.warn(`Could not extract video ID from URL: ${config.url}`);
      continue;
    }
    
    // Use publishedAt from config if available, otherwise generate a date
    const publishDate = config.publishedAt ? new Date(config.publishedAt) : new Date();
    if (!config.publishedAt) {
      // Generate dates 3 days apart, starting from today and going backward
      publishDate.setDate(publishDate.getDate() - (i * 3));
    }
    
    fallbackData.push({
      id: videoId,
      title: config.title || `YouTube Video ${i + 1}`,
      description: config.description || 'Video content from YouTube',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: publishDate.toISOString(),
      channelTitle: config.category || 'Tech Innovation',
      url: config.url || `https://youtube.com/watch?v=${videoId}`,
      category: config.category,
      featured: config.featured || false
    });
  }
  
  // Sort the fallback data by publishedAt date (newest first)
  return [...fallbackData].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Fetch videos from YouTube API
async function fetchFromYouTubeAPI(videoConfigs: any[]): Promise<YouTubeVideoData[] | null> {
  console.log('Fetching video details from YouTube API...');
  
  try {
    // Try different ways to access the API key with more robust fallbacks
    const possibleKeyNames = ['YOUTUBE_API_KEY', 'NEXT_PUBLIC_YOUTUBE_API_KEY', 'YOUTUBE_KEY'];
    let YOUTUBE_API_KEY = null;
    
    for (const keyName of possibleKeyNames) {
      if (process.env[keyName]) {
        YOUTUBE_API_KEY = process.env[keyName];
        console.log(`Found API key in environment variable: ${keyName}`);
        break;
      }
    }
    
    // Debug: Log whether we have an API key (without exposing the actual key)
    console.log('YouTube API key present:', !!YOUTUBE_API_KEY);
    if (!YOUTUBE_API_KEY) {
      console.log('No YouTube API key found, using fallback data');
      return null;
    }
    
    // Extract video IDs from the configs
    const videoData = videoConfigs.map(config => ({
      ...config,
      id: extractVideoId(config.url)
    })).filter(item => item.id);

    if (videoData.length === 0) {
      console.error('No valid video IDs found');
      return null;
    }

    const videoIds = videoData.map(item => item.id).join(',');

    // Fetch video details from YouTube API
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    console.log('YouTube API URL:', apiUrl.split('key=')[0] + 'key=***');
    console.log('First video ID being requested:', videoIds.split(',')[0]);
    
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(10000) // Increased timeout to 10 seconds
    });
    console.log(`YouTube API response received in ${Date.now() - startTime}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube API error status:', response.status);
      console.error('YouTube API error response:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('YouTube API response items:', data.items?.length || 0);
    
    if (!data.items || data.items.length === 0) {
      console.error('No video data in YouTube API response');
      return null;
    }
    
    // Transform the data to match our interface
    const videos: YouTubeVideoData[] = data.items.map((item: any) => {
      const config = videoData.find(v => v.id === item.id);
      
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description.length > 200 ? 
          item.snippet.description.substring(0, 200) + '...' : 
          item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || 
                  item.snippet.thumbnails.high?.url || 
                  item.snippet.thumbnails.medium?.url ||
                  `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        url: config?.url || `https://www.youtube.com/watch?v=${item.id}`,
        category: config?.category || 'Technology',
        featured: config?.featured || false
      };
    });

    // Sort videos by published date (newest first)
    return [...videos].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('YouTube API request failed:', error);
    return null;
  }
}

// Main function to get YouTube videos with caching
export async function getYouTubeVideos(forceRefresh = false): Promise<YouTubeVideoData[]> {
  // Check memory cache first
  if (!forceRefresh && memoryCache && isCacheValid(memoryCache.timestamp)) {
    console.log('Using in-memory YouTube cache');
    return memoryCache.videos;
  }
  
  // Check file cache next
  if (!forceRefresh) {
    const fileCache = await readCacheFile();
    if (fileCache && isCacheValid(fileCache.timestamp)) {
      console.log('Using file-based YouTube cache');
      // Update memory cache
      memoryCache = fileCache;
      return fileCache.videos;
    }
  }
  
  // Load video configuration from markdown file
  const videoConfigs = await loadYouTubeVideos();
  console.log('Loaded video configs from markdown:', videoConfigs.length);
  
  // Try to fetch from YouTube API
  const apiVideos = await fetchFromYouTubeAPI(videoConfigs);
  
  if (apiVideos) {
    console.log('Successfully retrieved YouTube videos from API');
    
    // Update caches
    memoryCache = {
      videos: apiVideos,
      timestamp: Date.now()
    };
    
    // Update file cache in the background
    writeCacheFile(apiVideos).catch(console.error);
    
    return apiVideos;
  }
  
  // Fall back to generating mock data
  console.log('Falling back to generated data');
  const fallbackVideos = await generateFallbackData(videoConfigs);
  
  // Update caches with fallback data (shorter TTL would be better but we'll use the same for simplicity)
  memoryCache = {
    videos: fallbackVideos,
    timestamp: Date.now()
  };
  
  // Update file cache in the background
  writeCacheFile(fallbackVideos).catch(console.error);
  
  return fallbackVideos;
}

// Function to refresh cache in the background
export async function refreshYouTubeCacheInBackground(): Promise<void> {
  try {
    console.log('Starting background refresh of YouTube cache');
    await getYouTubeVideos(true);
    console.log('Background refresh of YouTube cache completed');
  } catch (error) {
    console.error('Error refreshing YouTube cache in background:', error);
  }
}
