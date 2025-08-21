#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Check for missing video files
async function checkMissingVideos() {
  console.log('🔍 Checking for missing YouTube video files...\n');
  
  const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Index file not found:', indexPath);
    return;
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const { data } = matter(indexContent);
  
  if (!data.videos || !Array.isArray(data.videos)) {
    console.log('❌ No videos found in index file');
    return;
  }
  
  const missingVideos = [];
  const existingVideos = [];
  
  for (const video of data.videos) {
    if (!video.slug) continue;
    
    const videoPath = path.join(videosDir, `${video.slug}.md`);
    
    if (fs.existsSync(videoPath)) {
      existingVideos.push(video.slug);
    } else {
      missingVideos.push(video);
    }
  }
  
  console.log(`✅ Found ${existingVideos.length} existing video files`);
  console.log(`❌ Found ${missingVideos.length} missing video files\n`);
  
  if (missingVideos.length > 0) {
    console.log('Missing video files:');
    missingVideos.forEach(video => {
      console.log(`  • ${video.slug} (${video.category})`);
    });
    
    console.log('\n📝 To create missing files, run:');
    console.log('node scripts/create-missing-videos.js');
  } else {
    console.log('🎉 All video files are present!');
  }
}

checkMissingVideos().catch(console.error);