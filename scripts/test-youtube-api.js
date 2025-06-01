#!/usr/bin/env node

/**
 * Test script to verify the YouTube API routes with the new individual file structure
 * 
 * Usage:
 * node scripts/test-youtube-api.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Utility functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m%s\x1b[0m', // cyan
    success: '\x1b[32m%s\x1b[0m', // green
    warning: '\x1b[33m%s\x1b[0m', // yellow
    error: '\x1b[31m%s\x1b[0m', // red
  };
  
  console.log(colors[type], message);
}

// Test loading videos from the new structure
function testContentLoader() {
  log('\n=== Testing Content Loader ===', 'info');
  
  // Check if the new structure exists
  const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');
  
  if (!fs.existsSync(indexPath)) {
    log('❌ Index file not found: ' + indexPath, 'error');
    return false;
  }
  
  if (!fs.existsSync(videosDir)) {
    log('❌ Videos directory not found: ' + videosDir, 'error');
    return false;
  }
  
  // Read the index file
  try {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const { data } = matter(indexContent);
    
    if (!Array.isArray(data.videos)) {
      log('❌ Index file does not contain a videos array', 'error');
      return false;
    }
    
    log(`✅ Index file contains ${data.videos.length} videos`, 'success');
    
    // Check if video files exist
    let missingFiles = 0;
    for (const video of data.videos) {
      if (!video.slug) {
        log(`⚠️ Video in index is missing slug property`, 'warning');
        missingFiles++;
        continue;
      }
      
      const videoPath = path.join(videosDir, `${video.slug}.md`);
      if (!fs.existsSync(videoPath)) {
        log(`❌ Video file not found: ${videoPath}`, 'error');
        missingFiles++;
      }
    }
    
    if (missingFiles > 0) {
      log(`⚠️ ${missingFiles} video files are missing`, 'warning');
    } else {
      log(`✅ All video files exist`, 'success');
    }
    
    // Check a sample video file
    if (data.videos.length > 0 && data.videos[0].slug) {
      const sampleVideoPath = path.join(videosDir, `${data.videos[0].slug}.md`);
      const videoContent = fs.readFileSync(sampleVideoPath, 'utf8');
      const { data: videoData } = matter(videoContent);
      
      log(`✅ Sample video file contains:`, 'success');
      log(`   - Title: ${videoData.title}`, 'info');
      log(`   - URL: ${videoData.url}`, 'info');
      log(`   - Category: ${videoData.category}`, 'info');
      log(`   - Featured: ${videoData.featured}`, 'info');
      
      if (videoData.publishedAt) {
        log(`   - Published: ${videoData.publishedAt}`, 'info');
      }
      
      if (videoData.channelName) {
        log(`   - Channel: ${videoData.channelName}`, 'info');
      }
    }
    
    return true;
  } catch (error) {
    log(`❌ Error reading index file: ${error.message}`, 'error');
    return false;
  }
}

// Test the file structure
function testFileStructure() {
  log('\n=== Testing File Structure ===', 'info');
  
  // Check if both structures exist
  const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');
  const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
  
  const newStructureExists = fs.existsSync(indexPath) && fs.existsSync(videosDir);
  const oldStructureExists = fs.existsSync(oldFilePath);
  
  if (newStructureExists) {
    log('✅ New structure (individual files) exists', 'success');
    
    // Count video files
    const videoFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.md'));
    log(`   - Found ${videoFiles.length} video files`, 'info');
  } else {
    log('❌ New structure (individual files) does not exist', 'error');
  }
  
  if (oldStructureExists) {
    log('⚠️ Old structure (single file) still exists', 'warning');
    log('   - Consider renaming videos.md to videos.md.backup after testing', 'info');
  } else {
    log('✅ Old structure (single file) has been removed', 'success');
  }
  
  return newStructureExists;
}

// Main function
async function main() {
  log('Starting YouTube API test...', 'info');
  
  // Test file structure
  const fileStructureOk = testFileStructure();
  if (!fileStructureOk) {
    log('❌ File structure test failed', 'error');
    return;
  }
  
  // Test content loader
  const contentLoaderOk = testContentLoader();
  if (!contentLoaderOk) {
    log('❌ Content loader test failed', 'error');
    return;
  }
  
  log('\n✅ All tests passed successfully!', 'success');
  log('\nNext steps:', 'info');
  log('1. Start the development server to test the admin UI', 'info');
  log('2. Try adding, updating, and deleting videos through the admin UI', 'info');
  log('3. Once verified, rename videos.md to videos.md.backup', 'info');
  log('4. Consider removing the fallback to the old structure in the future', 'info');
}

// Run the tests
main().catch(error => {
  log(`❌ Test failed with error: ${error.message}`, 'error');
  console.error(error);
});
