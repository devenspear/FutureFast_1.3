#!/usr/bin/env node

/**
 * YouTube Video Management Script
 * 
 * This script allows you to easily add new YouTube videos to the FutureFast website.
 * It adds the video to the content/youtube/videos.md file and triggers the YouTube API
 * to fetch the metadata.
 * 
 * Usage:
 *   node scripts/add-youtube-video.js <youtube-url> [category] [featured]
 * 
 * Example:
 *   node scripts/add-youtube-video.js https://www.youtube.com/watch?v=dQw4w9WgXcQ "Tech Innovation" true
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

// Function to extract video ID from various YouTube URL formats
function extractVideoId(url) {
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

// Function to validate a YouTube URL
function isValidYouTubeUrl(url) {
  return !!extractVideoId(url);
}

// Function to make a simple HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP Status Code: ${res.statusCode}`));
      }

      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data).toString()));
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const url = args[0];
    const category = args[1] || 'Interview';
    const featured = args[2] === 'true';
    
    if (!url) {
      console.error('Error: YouTube URL is required');
      console.log('Usage: node scripts/add-youtube-video.js <youtube-url> [category] [featured]');
      process.exit(1);
    }
    
    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      console.error('Error: Invalid YouTube URL');
      process.exit(1);
    }
    
    const videoId = extractVideoId(url);
    console.log(`Processing YouTube video: ${videoId}`);
    
    // Read the existing videos.md file
    const filePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    if (!fs.existsSync(filePath)) {
      console.error('Error: Videos file not found at:', filePath);
      process.exit(1);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Check if the video already exists
    const videos = data.videos || [];
    const videoExists = videos.some((video) => {
      const existingVideoId = extractVideoId(video.url);
      return existingVideoId === videoId;
    });
    
    if (videoExists) {
      console.error('Error: Video already exists in the list');
      process.exit(1);
    }
    
    // Add the new video entry
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
    fs.writeFileSync(filePath, updatedFileContent, 'utf8');
    
    console.log('Video added to videos.md with placeholder metadata');
    
    // Try to trigger the YouTube API to fetch metadata
    console.log('Triggering YouTube API to fetch metadata...');
    
    try {
      // Get the base URL from environment or use localhost
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/youtube?refresh=true`;
      
      // Try to make a request to the API
      const response = await makeRequest(apiUrl);
      console.log('YouTube API triggered successfully');
    } catch (error) {
      console.warn('Warning: Could not trigger YouTube API automatically:', error.message);
      console.log('The metadata will be updated the next time the website is built or deployed');
    }
    
    console.log('\nSuccess! YouTube video added successfully.');
    console.log(`Video ID: ${videoId}`);
    console.log(`Category: ${category}`);
    console.log(`Featured: ${featured}`);
    console.log('\nYou can now run the development server to see the changes:');
    console.log('  npm run dev');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
