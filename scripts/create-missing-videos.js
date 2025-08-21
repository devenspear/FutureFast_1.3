#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Extract video ID from YouTube URL
function extractVideoId(url) {
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

// Create missing video files
async function createMissingVideos() {
  console.log('🛠️ Creating missing YouTube video files...\n');
  
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
  
  for (const video of data.videos) {
    if (!video.slug) continue;
    
    const videoPath = path.join(videosDir, `${video.slug}.md`);
    
    if (!fs.existsSync(videoPath)) {
      missingVideos.push(video);
    }
  }
  
  if (missingVideos.length === 0) {
    console.log('✅ No missing video files found!');
    return;
  }
  
  console.log(`📝 Creating ${missingVideos.length} missing video files...\n`);
  
  for (const video of missingVideos) {
    const videoPath = path.join(videosDir, `${video.slug}.md`);
    
    // Extract video ID from slug
    const videoId = video.slug.replace('video-', '');
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Create basic video file content
    const videoContent = {
      url: youtubeUrl,
      title: "[Pending YouTube API]",
      description: "[Will be filled by API]",
      category: video.category || 'Interview',
      featured: video.featured || false
    };
    
    const fileContent = matter.stringify('', videoContent);
    
    fs.writeFileSync(videoPath, fileContent, 'utf8');
    console.log(`✅ Created: ${video.slug}.md`);
  }
  
  console.log(`\n🎉 Created ${missingVideos.length} video files!`);
  console.log('\n💡 Next steps:');
  console.log('1. Run your YouTube API to fetch metadata');
  console.log('2. Commit and push changes to deploy');
}

createMissingVideos().catch(console.error);