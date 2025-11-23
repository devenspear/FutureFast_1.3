/**
 * Script to fix all video thumbnails in the database
 * Changes from img.youtube.com/maxresdefault.jpg to i.ytimg.com/hqdefault.jpg
 */

import { sql } from '@vercel/postgres';

async function fixAllThumbnails() {
  console.log('🔧 Fixing all video thumbnails in database...\n');

  try {
    // Get all videos
    const result = await sql`
      SELECT id, video_id, title, thumbnail_url
      FROM youtube_videos
      ORDER BY created_at DESC
    `;

    console.log(`📊 Found ${result.rows.length} videos in database\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const video of result.rows) {
      const currentThumbnail = video.thumbnail_url;

      // Check if thumbnail needs fixing
      const needsFix = currentThumbnail && (
        currentThumbnail.includes('img.youtube.com') ||
        currentThumbnail.includes('maxresdefault.jpg') ||
        currentThumbnail.includes('sddefault.jpg')
      );

      if (needsFix) {
        // Generate new thumbnail URL using i.ytimg.com and hqdefault
        const newThumbnail = `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`;

        console.log(`🔄 Fixing ${video.video_id}:`);
        console.log(`   Old: ${currentThumbnail}`);
        console.log(`   New: ${newThumbnail}`);

        // Update the database
        await sql`
          UPDATE youtube_videos
          SET thumbnail_url = ${newThumbnail}
          WHERE id = ${video.id}
        `;

        fixedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Fixed: ${fixedCount} videos`);
    console.log(`   ⏭️  Skipped: ${skippedCount} videos (already correct)`);
    console.log(`   📁 Total processed: ${result.rows.length} videos`);

    console.log('\n✨ All thumbnails fixed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error fixing thumbnails:', error);
    process.exit(1);
  }
}

fixAllThumbnails();
