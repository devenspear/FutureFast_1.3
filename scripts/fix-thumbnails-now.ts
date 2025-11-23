import { sql } from '@vercel/postgres';

async function fixThumbnails() {
  console.log('🔧 Fixing all video thumbnails in production database...\n');

  try {
    // Get current state
    const before = await sql`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN thumbnail_url LIKE '%i.ytimg.com%hqdefault.jpg%' THEN 1 END) as correct
      FROM youtube_videos
    `;
    console.log('📊 Before fix:');
    console.log(`   Total videos: ${before.rows[0].total}`);
    console.log(`   Correct thumbnails: ${before.rows[0].correct}`);
    console.log(`   Need fixing: ${Number(before.rows[0].total) - Number(before.rows[0].correct)}\n`);

    // Fix all thumbnails
    const result = await sql`
      UPDATE youtube_videos
      SET thumbnail_url = 'https://i.ytimg.com/vi/' || video_id || '/hqdefault.jpg'
      WHERE thumbnail_url NOT LIKE '%i.ytimg.com%hqdefault.jpg%'
         OR thumbnail_url IS NULL
    `;
    console.log(`✅ Updated ${result.rowCount} video thumbnails\n`);

    // Get final state
    const after = await sql`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN thumbnail_url LIKE '%i.ytimg.com%hqdefault.jpg%' THEN 1 END) as correct
      FROM youtube_videos
    `;
    console.log('📊 After fix:');
    console.log(`   Total videos: ${after.rows[0].total}`);
    console.log(`   Correct thumbnails: ${after.rows[0].correct}\n`);

    // Show sample of fixed videos
    const samples = await sql`
      SELECT video_id, title, thumbnail_url
      FROM youtube_videos
      ORDER BY updated_at DESC
      LIMIT 5
    `;
    console.log('📸 Sample of fixed videos:');
    samples.rows.forEach((video: any) => {
      console.log(`   ✅ ${video.video_id} - ${video.title.substring(0, 50)}`);
      console.log(`      ${video.thumbnail_url}`);
    });

    console.log('\n🎉 All thumbnails fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixThumbnails();
