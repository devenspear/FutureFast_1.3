/**
 * Public YouTube API
 * Returns all published YouTube videos from the database
 *
 * This replaces the old cache-based system and reads directly from Postgres
 */

import { NextResponse } from 'next/server';
import { YouTubeModel } from '@/lib/db/models';

export async function GET(request: Request) {
  console.log('YouTube API endpoint called');

  try {
    // Fetch all published videos from database
    const videos = await YouTubeModel.findAll({
      status: 'published',
      limit: 1000, // Get all published videos
    });

    // Transform to match expected format (for backwards compatibility)
    const videoItems = videos.map((video) => ({
      id: video.video_id,
      videoId: video.video_id,
      title: video.title,
      description: video.description || '',
      url: video.url,
      thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`,
      thumbnailUrl: video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`,
      channelTitle: video.channel || 'YouTube',
      channel: video.channel || 'YouTube',
      publishedAt: video.published_date?.toISOString() || video.created_at.toISOString(),
      category: video.category || 'Interview',
      featured: video.featured,
      duration: video.duration || 0,
      tags: video.tags || [],
    }));

    // If no videos found, return default fallback videos
    if (videoItems.length === 0) {
      console.log('No videos in database, returning fallback videos');
      const fallbackVideos = [
        {
          id: 'JhHMJCUmq28',
          videoId: 'JhHMJCUmq28',
          title: 'The Future of AI: What\'s Next?',
          description: 'Exploring the latest developments in artificial intelligence and machine learning',
          url: 'https://www.youtube.com/watch?v=JhHMJCUmq28',
          thumbnail: 'https://img.youtube.com/vi/JhHMJCUmq28/maxresdefault.jpg',
          thumbnailUrl: 'https://img.youtube.com/vi/JhHMJCUmq28/maxresdefault.jpg',
          channelTitle: 'Tech Insights',
          channel: 'Tech Insights',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          category: 'Interview',
          featured: true,
          duration: 0,
          tags: ['AI', 'Technology'],
        },
        {
          id: '6Zpku4HNT-0',
          videoId: '6Zpku4HNT-0',
          title: 'Web3 Revolution: Blockchain Explained',
          description: 'Deep dive into blockchain technology and its impact on the future',
          url: 'https://www.youtube.com/watch?v=6Zpku4HNT-0',
          thumbnail: 'https://img.youtube.com/vi/6Zpku4HNT-0/maxresdefault.jpg',
          thumbnailUrl: 'https://img.youtube.com/vi/6Zpku4HNT-0/maxresdefault.jpg',
          channelTitle: 'Crypto Today',
          channel: 'Crypto Today',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          category: 'Education',
          featured: false,
          duration: 0,
          tags: ['Web3', 'Blockchain'],
        },
        {
          id: 'aircAruvnKk',
          videoId: 'aircAruvnKk',
          title: 'Understanding Neural Networks',
          description: 'A visual introduction to neural networks and deep learning',
          url: 'https://www.youtube.com/watch?v=aircAruvnKk',
          thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
          thumbnailUrl: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
          channelTitle: '3Blue1Brown',
          channel: '3Blue1Brown',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          category: 'Tutorial',
          featured: false,
          duration: 0,
          tags: ['AI', 'Neural Networks'],
        },
        {
          id: 'VyLU8hlhI-I',
          videoId: 'VyLU8hlhI-I',
          title: 'Robotics and Automation Trends',
          description: 'Latest advances in robotics and industrial automation',
          url: 'https://www.youtube.com/watch?v=VyLU8hlhI-I',
          thumbnail: 'https://img.youtube.com/vi/VyLU8hlhI-I/maxresdefault.jpg',
          thumbnailUrl: 'https://img.youtube.com/vi/VyLU8hlhI-I/maxresdefault.jpg',
          channelTitle: 'Robotics Weekly',
          channel: 'Robotics Weekly',
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
          category: 'News',
          featured: false,
          duration: 0,
          tags: ['Robotics', 'Automation'],
        },
      ];
      return NextResponse.json(fallbackVideos);
    }

    return NextResponse.json(videoItems);

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// Optional: Add POST endpoint for future use (e.g., webhooks)
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
