/**
 * Script to add/update the 3 missing videos in production database
 * Run this with: POSTGRES_URL="your-production-db-url" npx tsx scripts/fix-production-videos.ts
 */

import { sql as createSql } from '@vercel/postgres';

const missingVideos = [
  {
    video_id: '_ltuZlGdMsg',
    title: 'Elon Musk and Jensen Huang discuss the future of technology, AI and space at US-Saudi forum',
    description: 'Watch live as Elon Musk joins Jensen Huang, founder & CEO at NVIDIA, and Abdullah A. Alswaha, Saudi Arabia\'s minister of communications & information technology, at a discussion on the future of technology at the US-Saudi Investment Forum.',
    url: 'https://www.youtube.com/watch?v=_ltuZlGdMsg',
    thumbnail_url: 'https://i.ytimg.com/vi/_ltuZlGdMsg/hqdefault.jpg',
    channel: 'YouTube',
    published_date: '2025-11-19',
    category: 'Interview',
    featured: false,
    status: 'published',
    duration: 0,
  },
  {
    video_id: 'Inj0uHtzYsQ',
    title: 'LIVE: President Trump Joins Elon Musk & Nvidia CEO at U.S.-Saudi Economic Powerhouse Event',
    description: 'DRM News provides live coverage of the U.S.-Saudi Investment Forum in Washington, D.C., featuring Elon Musk and Jensen Huang\'s AI discussion from 1554 GMT, moderated by Abdullah Alswaha, and President Trump\'s remarks from 1700 GMT.',
    url: 'https://www.youtube.com/watch?v=Inj0uHtzYsQ',
    thumbnail_url: 'https://i.ytimg.com/vi/Inj0uHtzYsQ/hqdefault.jpg',
    channel: 'DRM News',
    published_date: '2025-11-20',
    category: 'Interview',
    featured: false,
    status: 'published',
    duration: 0,
  },
  {
    video_id: 'shyRdBz2coI',
    title: 'Technology Discussion and Future Trends',
    description: 'An in-depth discussion about technology, innovation, and future trends in the tech industry.',
    url: 'https://www.youtube.com/watch?v=shyRdBz2coI',
    thumbnail_url: 'https://i.ytimg.com/vi/shyRdBz2coI/hqdefault.jpg',
    channel: 'YouTube',
    published_date: '2025-11-18',
    category: 'AI & Future of Work',
    featured: false,
    status: 'published',
    duration: 0,
  },
];

async function fixProductionVideos() {
  console.log('🔧 Fixing missing videos in production database...\n');

  for (const video of missingVideos) {
    try {
      // Check if video exists
      const existing = await createSql`
        SELECT id, status, title FROM youtube_videos
        WHERE video_id = ${video.video_id}
      `;

      if (existing.rows.length > 0) {
        const existingVideo = existing.rows[0];
        console.log(`Found existing video: ${video.video_id}`);
        console.log(`  Status: ${existingVideo.status}`);
        console.log(`  Title: ${existingVideo.title}`);

        // Update if it's archived or has placeholder data
        if (existingVideo.status === 'archived' || existingVideo.title === '[Pending YouTube API]') {
          console.log(`  ↻ Updating...`);
          await createSql`
            UPDATE youtube_videos
            SET
              title = ${video.title},
              description = ${video.description},
              channel = ${video.channel},
              published_date = ${video.published_date},
              category = ${video.category},
              featured = ${video.featured},
              status = ${video.status}
            WHERE video_id = ${video.video_id}
          `;
          console.log(`  ✅ Updated!\n`);
        } else {
          console.log(`  ⏭️  Skipped (already published)\n`);
        }
      } else {
        // Insert new video
        console.log(`Creating new video: ${video.video_id}`);
        await createSql`
          INSERT INTO youtube_videos (
            video_id,
            url,
            title,
            description,
            channel,
            thumbnail_url,
            duration,
            published_date,
            category,
            tags,
            featured,
            status,
            created_by
          ) VALUES (
            ${video.video_id},
            ${video.url},
            ${video.title},
            ${video.description},
            ${video.channel},
            ${video.thumbnail_url},
            ${video.duration},
            ${video.published_date},
            ${video.category},
            NULL,
            ${video.featured},
            ${video.status},
            'admin'
          )
        `;
        console.log(`  ✅ Created!\n`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${video.video_id}:`, error);
    }
  }

  console.log('\n✨ Done!');
  process.exit(0);
}

fixProductionVideos().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
