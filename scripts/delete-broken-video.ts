/**
 * Script to delete the broken video (shyRdBz2coI) that is unavailable on YouTube
 * Usage: npx tsx scripts/delete-broken-video.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

import { YouTubeModel } from '../src/lib/db/models';

async function deleteVideo() {
  const videoId = 'shyRdBz2coI';

  console.log(`🗑️  Looking for broken video: ${videoId}`);

  const video = await YouTubeModel.findByVideoId(videoId);

  if (!video) {
    console.log('❌ Video not found in database');
    process.exit(1);
  }

  console.log(`Found: ${video.title} (ID: ${video.id})`);
  console.log('Deleting...');

  await YouTubeModel.delete(video.id);

  console.log('✅ Deleted successfully! Video removed from database.');
  process.exit(0);
}

deleteVideo().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
