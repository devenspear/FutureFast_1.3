/**
 * Migration script to convert YouTube videos from a single markdown file
 * to individual markdown files per video
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

// Configuration
const SOURCE_FILE = path.join(__dirname, '../content/youtube/videos.md');
const TARGET_DIR = path.join(__dirname, '../content/youtube/videos');
const INDEX_FILE = path.join(__dirname, '../content/youtube/index.md');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Read the source file
const sourceContent = fs.readFileSync(SOURCE_FILE, 'utf8');
const { data, content } = matter(sourceContent);
const videos = data.videos || [];

console.log(`Found ${videos.length} videos in source file`);

// Helper function to clean objects of undefined values
function cleanObject(obj) {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
}

// Create index file to maintain ordering and featured status
const videoIndex = {
  videos: videos.map(video => {
    // Generate a slug from the title or use a UUID if title is pending
    const slug = video.title && video.title.includes('[Pending') 
      ? `pending-${uuidv4().substring(0, 8)}`
      : slugify(video.title || 'untitled-video', { lower: true, strict: true });
    
    // Return minimal reference for the index with clean values
    return cleanObject({
      slug,
      featured: video.featured || false,
      category: video.category || 'Uncategorized',
      publishedAt: video.publishedAt || null
    });
  })
};

// Write index file
fs.writeFileSync(
  INDEX_FILE, 
  matter.stringify('# YouTube Videos Index\n\nThis file maintains the order and featured status of videos.', videoIndex),
  'utf8'
);

// Create individual files for each video
videos.forEach((video, index) => {
  // Generate a slug from the title or use a UUID if title is pending
  const slug = videoIndex.videos[index].slug;
  
  // Create individual video file with clean data (no undefined values)
  const videoData = cleanObject({
    ...video,
    slug
  });
  
  // Write to individual file
  const filePath = path.join(TARGET_DIR, `${slug}.md`);
  const title = video.title || 'YouTube Video';
  fs.writeFileSync(
    filePath,
    matter.stringify(`# ${title}\n\nYouTube video content.`, videoData),
    'utf8'
  );
  
  console.log(`Created ${filePath}`);
});

console.log(`\nMigration complete!`);
console.log(`- Created ${videos.length} individual video files in ${TARGET_DIR}`);
console.log(`- Created index file at ${INDEX_FILE}`);
console.log(`\nThe original file ${SOURCE_FILE} has not been modified.`);
console.log(`\nNext steps: Update the content-loader.ts file to read from individual files.`);
