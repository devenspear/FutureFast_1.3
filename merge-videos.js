const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Read the local and GitHub versions
const localFilePath = path.join(__dirname, 'content/youtube/videos.md');
const githubFilePath = path.join(__dirname, 'temp/github_videos.md');
const outputFilePath = path.join(__dirname, 'content/youtube/videos-merged.md');

// Parse the files
const localFileContent = fs.readFileSync(localFilePath, 'utf8');
const githubFileContent = fs.readFileSync(githubFilePath, 'utf8');

const localData = matter(localFileContent);
const githubData = matter(githubFileContent);

// Extract the videos arrays
const localVideos = localData.data.videos || [];
const githubVideos = githubData.data.videos || [];

// Create a map of videos by URL for quick lookup
const videoMap = new Map();

// First add all local videos to the map (preserving metadata)
localVideos.forEach(video => {
  videoMap.set(video.url, video);
});

// Then add GitHub videos that don't exist locally
githubVideos.forEach(video => {
  if (!videoMap.has(video.url)) {
    // This is a new video from GitHub, add it
    videoMap.set(video.url, video);
  }
});

// Convert the map back to an array
const mergedVideos = Array.from(videoMap.values());

// Sort videos by publishedAt date if available (newest first)
mergedVideos.sort((a, b) => {
  if (a.publishedAt && b.publishedAt) {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  }
  if (a.publishedAt) return -1;
  if (b.publishedAt) return 1;
  return 0;
});

// Create the new content
const newData = {
  ...localData.data,
  videos: mergedVideos
};

// Generate the new markdown content
const newContent = matter.stringify(localData.content, newData);

// Write the merged content to a new file
fs.writeFileSync(outputFilePath, newContent, 'utf8');

console.log(`Merged ${mergedVideos.length} videos (${localVideos.length} local, ${githubVideos.length} from GitHub)`);
console.log(`Output written to ${outputFilePath}`);
