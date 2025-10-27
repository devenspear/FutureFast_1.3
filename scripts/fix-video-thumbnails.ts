/**
 * Script to fetch and update YouTube video thumbnails with actual URLs from API
 * This fixes gray placeholder thumbnails by getting the correct thumbnail URLs
 * Usage: npx tsx scripts/fix-video-thumbnails.ts
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
      thumbnails: {
        maxres?: { url: string; width: number; height: number };
        high?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        default?: { url: string; width: number; height: number };
      };
    };
  }>;
}

async function fetchThumbnailUrl(videoId: string): Promise<string | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

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

    const thumbnails = data.items[0].snippet.thumbnails;

    // Try to get the highest quality thumbnail available
    const thumbnailUrl =
      thumbnails.maxres?.url ||
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url ||
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return thumbnailUrl;
  } catch (error) {
    console.error(`❌ Error fetching thumbnail for ${videoId}:`, error);
    return null;
  }
}

async function fixThumbnails() {
  console.log('🖼️  Fetching all videos from database...\n');

  const videos = await YouTubeModel.findAll({ limit: 1000 });

  console.log(`Found ${videos.length} videos to process\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const video of videos) {
    try {
      console.log(`📹 Processing: ${video.title} (${video.video_id})`);

      // Check if thumbnail is generic or missing
      const isGenericThumbnail =
        !video.thumbnail_url ||
        video.thumbnail_url.includes('img.youtube.com/vi/');

      if (!isGenericThumbnail) {
        console.log(`   ⏭️  Already has proper thumbnail, skipping\n`);
        skippedCount++;
        continue;
      }

      // Fetch real thumbnail URL from YouTube
      const thumbnailUrl = await fetchThumbnailUrl(video.video_id);

      if (!thumbnailUrl) {
        console.log(`   ⚠️  Could not fetch thumbnail, skipping\n`);
        errorCount++;
        continue;
      }

      // Update the video with correct thumbnail
      await YouTubeModel.update(video.id, {
        thumbnail_url: thumbnailUrl,
      });

      console.log(`   ✅ Updated thumbnail: ${thumbnailUrl.substring(0, 80)}...\n`);
      successCount++;

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`   ❌ Error processing ${video.video_id}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Thumbnail Update Summary:');
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ⏭️  Skipped (already good): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Total videos processed: ${videos.length}`);
}

// Run the fix
fixThumbnails()
  .then(() => {
    console.log('\n✨ Thumbnail fix complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Thumbnail fix failed:', error);
    process.exit(1);
  });
