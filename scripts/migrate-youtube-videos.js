#!/usr/bin/env node

/**
 * Migration script to convert YouTube videos from a single videos.md file
 * to individual markdown files with an index.
 * 
 * Usage:
 * node scripts/migrate-youtube-videos.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Extract video ID from YouTube URL
function extractVideoId(url) {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([^?&#]+)/);
    return match ? match[1] : null;
  }
  
  // Handle youtube.com format
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

// Generate a slug for a video
function generateSlug(videoId) {
  return `video-${videoId}`;
}

async function migrateVideos() {
  console.log('Starting YouTube video migration...');
  
  // Define paths
  const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');
  const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
  
  // Check if old file exists
  if (!fs.existsSync(oldFilePath)) {
    console.error('Error: videos.md file not found at', oldFilePath);
    return;
  }
  
  // Create videos directory if it doesn't exist
  if (!fs.existsSync(videosDir)) {
    console.log('Creating videos directory at', videosDir);
    fs.mkdirSync(videosDir, { recursive: true });
  }
  
  // Read the old file
  console.log('Reading videos.md file...');
  const fileContent = fs.readFileSync(oldFilePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  if (!Array.isArray(data.videos) || data.videos.length === 0) {
    console.error('Error: No videos found in videos.md');
    return;
  }
  
  console.log(`Found ${data.videos.length} videos to migrate`);
  
  // Create index data structure
  const indexData = {
    videos: []
  };
  
  // Process each video
  let migratedCount = 0;
  let skippedCount = 0;
  
  for (const video of data.videos) {
    const videoId = extractVideoId(video.url);
    
    if (!videoId) {
      console.warn('Warning: Could not extract video ID from URL', video.url);
      skippedCount++;
      continue;
    }
    
    const slug = generateSlug(videoId);
    
    // Add to index
    indexData.videos.push({
      slug,
      category: video.category || 'Interview',
      featured: video.featured || false
    });
    
    // Create individual video file
    const videoPath = path.join(videosDir, `${slug}.md`);
    
    // Skip if file already exists
    if (fs.existsSync(videoPath)) {
      console.log(`Video file already exists for ${videoId}, skipping...`);
      skippedCount++;
      continue;
    }
    
    // Create video data
    const videoData = {
      url: video.url,
      title: video.title || "[Pending YouTube API]",
      description: video.description || "[Will be filled by API]",
      category: video.category || 'Interview',
      featured: video.featured || false
    };
    
    // Only add these properties if they exist to avoid undefined values in YAML
    if (video.publishedAt) videoData.publishedAt = video.publishedAt;
    if (video.channelName) videoData.channelName = video.channelName;
    
    // Write video file
    const videoContent = matter.stringify('', videoData);
    fs.writeFileSync(videoPath, videoContent, 'utf8');
    migratedCount++;
    
    console.log(`Migrated video: ${videoId} (${slug}.md)`);
  }
  
  // Write index file
  console.log('Writing index file...');
  const indexContent = matter.stringify('', indexData);
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  
  console.log('\nMigration complete!');
  console.log(`- Total videos: ${data.videos.length}`);
  console.log(`- Successfully migrated: ${migratedCount}`);
  console.log(`- Skipped: ${skippedCount}`);
  console.log(`- Index file created at: ${indexPath}`);
  console.log(`- Video files created in: ${videosDir}`);
  
  if (migratedCount > 0) {
    console.log('\nThe old videos.md file has been preserved. Once you verify everything works correctly,');
    console.log('you can safely remove it or rename it to videos.md.backup');
  }
}

// Run the migration
migrateVideos().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
