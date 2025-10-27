/**
 * Script to fetch and update YouTube video publication dates from YouTube API
 * Usage: npx tsx scripts/fix-video-dates.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

import { YouTubeModel } from '../src/lib/db/models';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('❌ YOUTUBE_API_KEY not found in environment variables');
  process.exit(1);
}

interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      publishedAt: string;
      title: string;
      channelTitle: string;
    };
    contentDetails: {
      duration: string;
    };
  }>;
}

// Convert ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchYouTubeMetadata(videoId: string): Promise<{ publishedAt: Date; channel: string; duration: number } | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ YouTube API error for ${videoId}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: YouTubeVideoResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      console.error(`❌ No data found for video ${videoId}`);
      return null;
    }

    const video = data.items[0];
    return {
      publishedAt: new Date(video.snippet.publishedAt),
      channel: video.snippet.channelTitle,
      duration: parseDuration(video.contentDetails.duration),
    };
  } catch (error) {
    console.error(`❌ Error fetching metadata for ${videoId}:`, error);
    return null;
  }
}

async function fixVideoDates() {
  console.log('🔍 Fetching all videos from database...\n');

  const videos = await YouTubeModel.findAll({ limit: 1000 });

  console.log(`Found ${videos.length} videos to process\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const video of videos) {
    try {
      console.log(`📹 Processing: ${video.title} (${video.video_id})`);

      // Fetch real metadata from YouTube
      const metadata = await fetchYouTubeMetadata(video.video_id);

      if (!metadata) {
        console.log(`   ⚠️  Could not fetch metadata, skipping\n`);
        skippedCount++;
        continue;
      }

      // Update the video with correct data
      await YouTubeModel.update(video.id, {
        published_date: metadata.publishedAt,
        channel: metadata.channel,
        duration: metadata.duration,
      });

      console.log(`   ✅ Updated: ${metadata.publishedAt.toISOString().split('T')[0]} | ${metadata.channel} | ${metadata.duration}s\n`);
      successCount++;

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`   ❌ Error processing ${video.video_id}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Update Summary:');
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ⚠️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Total videos processed: ${videos.length}`);
}

// Run the fix
fixVideoDates()
  .then(() => {
    console.log('\n✨ Date fix complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Date fix failed:', error);
    process.exit(1);
  });
