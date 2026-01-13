'use server';

// Function to extract video ID from various YouTube URL formats
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Function to generate a YouTube thumbnail URL from a video ID
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Function to get the YouTube watch URL from a video ID
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://youtube.com/watch?v=${videoId}`;
}

// Function to validate a YouTube URL
export function isValidYouTubeUrl(url: string): boolean {
  return !!extractVideoId(url);
}
