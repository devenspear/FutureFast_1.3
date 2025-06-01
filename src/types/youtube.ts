// Extended interface for YouTube videos that includes ID
export interface YouTubeVideoItem {
  id?: string;
  url: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  publishedAt?: string; // Optional as it will be populated from YouTube API
  channelName?: string; // Optional as it will be populated from YouTube API
}
