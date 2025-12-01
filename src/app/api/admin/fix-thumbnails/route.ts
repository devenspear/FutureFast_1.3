/**
 * Admin API endpoint to fix all video thumbnails
 * POST /api/admin/fix-thumbnails
 */

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    // Auth is handled by middleware - /api/admin/* routes are protected
    console.log('🔧 Fixing all video thumbnails...');

    // Get all videos
    const result = await sql`
      SELECT id, video_id, title, thumbnail_url
      FROM youtube_videos
      ORDER BY created_at DESC
    `;

    console.log(`📊 Found ${result.rows.length} videos in database`);

    let fixedCount = 0;
    let skippedCount = 0;
    const fixed: string[] = [];

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

        console.log(`🔄 Fixing ${video.video_id}`);
        console.log(`   Old: ${currentThumbnail}`);
        console.log(`   New: ${newThumbnail}`);

        // Update the database
        await sql`
          UPDATE youtube_videos
          SET thumbnail_url = ${newThumbnail}
          WHERE id = ${video.id}
        `;

        fixed.push(`${video.video_id} - ${video.title}`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ Fixed ${fixedCount} thumbnails, skipped ${skippedCount}`);

    return NextResponse.json({
      success: true,
      summary: {
        fixedCount,
        skippedCount,
        totalVideos: result.rows.length,
      },
      fixed: fixed.slice(0, 10), // Return first 10 for display
      message: `Fixed ${fixedCount} thumbnails. All videos now use i.ytimg.com/hqdefault.jpg format.`,
    });

  } catch (error) {
    console.error('Thumbnail fix error:', error);
    return NextResponse.json(
      { error: 'Thumbnail fix failed', details: String(error) },
      { status: 500 }
    );
  }
}
