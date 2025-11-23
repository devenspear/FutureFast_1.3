/**
 * Migration script to move YouTube videos from markdown files to PostgreSQL
 * Usage: npx tsx scripts/migrate-videos-to-db.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

import { YouTubeModel } from '../src/lib/db/models';

interface VideoFrontmatter {
  url: string;
  title: string;
  description: string;
  publishedDate?: string;
  publishedAt?: string;  // Support both field names
  category: string;
  featured: boolean;
}

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

async function migrateVideos() {
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');

  console.log('📂 Reading video files from:', videosDir);

  // Read all markdown files
  const files = fs.readdirSync(videosDir).filter(file => file.endsWith('.md'));

  console.log(`Found ${files.length} video files`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(videosDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const frontmatter = data as VideoFrontmatter;

      // Extract video ID
      const videoId = extractVideoId(frontmatter.url);

      if (!videoId) {
        console.log(`⚠️  Could not extract video ID from ${file}: ${frontmatter.url}`);
        skippedCount++;
        continue;
      }

      // Check if video already exists
      const existing = await YouTubeModel.findByVideoId(videoId);

      if (existing) {
        console.log(`⏭️  Skipping ${videoId} - already exists in database`);
        skippedCount++;
        continue;
      }

      // Parse published date, use current date if not available
      let publishedDate: Date;
      const dateString = frontmatter.publishedAt || frontmatter.publishedDate;
      if (dateString) {
        publishedDate = new Date(dateString);
        // Check if date is valid
        if (isNaN(publishedDate.getTime())) {
          console.log(`⚠️  Invalid date for ${videoId}, using current date`);
          publishedDate = new Date();
        }
      } else {
        // Use current date if no publishedDate
        publishedDate = new Date();
      }

      // Create video record
      // Use i.ytimg.com domain with hqdefault for better compatibility
      const videoData = {
        video_id: videoId,
        title: frontmatter.title,
        description: frontmatter.description || '',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channel: 'YouTube', // Default channel, update manually if needed
        published_date: publishedDate,
        category: frontmatter.category || 'Interview',
        featured: frontmatter.featured || false,
        status: 'published' as const,
        duration: 0, // Will be populated by YouTube API if integrated
        tags: null, // Use null instead of [] for PostgreSQL
      };

      await YouTubeModel.create(videoData);
      console.log(`✅ Migrated: ${frontmatter.title} (${videoId})`);
      successCount++;

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successfully migrated: ${successCount}`);
  console.log(`   ⏭️  Skipped (duplicates): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Total files processed: ${files.length}`);
}

// Run migration
migrateVideos()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
