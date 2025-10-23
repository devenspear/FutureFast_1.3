/**
 * Notion to Postgres Migration Script
 * Migrates all content from Notion database to Vercel Postgres
 *
 * Usage: npx tsx scripts/migrate-notion-to-postgres.ts
 */

import { NewsModel, YouTubeModel } from '../src/lib/db/models';
import EnhancedNotionClient from '../lib/enhanced-notion-client';

interface MigrationStats {
  newsTotal: number;
  newsSuccess: number;
  newsFailed: number;
  youtubeTotal: number;
  youtubeSuccess: number;
  youtubeFailed: number;
  errors: string[];
}

async function migrateNews(notionClient: EnhancedNotionClient, stats: MigrationStats) {
  console.log('\n📰 Migrating News Articles from Notion...\n');

  try {
    // Fetch all content from Notion
    const allContent = await notionClient.getAllContent();
    const newsArticles = allContent.filter(item => item.contentType === 'News Article');

    stats.newsTotal = newsArticles.length;
    console.log(`Found ${newsArticles.length} news articles in Notion\n`);

    for (const article of newsArticles) {
      try {
        console.log(`Processing: ${article.title}`);

        // Check if already exists in Postgres
        const existing = await NewsModel.findByUrl(article.sourceUrl);
        if (existing) {
          console.log(`  ⏭️  Already exists, skipping\n`);
          continue;
        }

        // Create in Postgres
        await NewsModel.create({
          title: article.title,
          url: article.sourceUrl,
          source: article.source,
          summary: article.description || null,
          published_date: article.publishedDate || new Date().toISOString(),
          date_confidence: article.dateConfidence || null,
          date_extraction_method: article.dateExtractionMethod || null,
          date_extraction_notes: article.dateExtractionNotes || null,
          category: article.category || null,
          tags: [],
          icon: '📰',
          featured: article.featured || false,
          status: article.status === 'Published' ? 'published' : 'draft',
          needs_review: article.needsReview || false,
          review_priority: (article.reviewPriority as any) || null,
          created_by: 'notion-migration',
          processed_by: 'Notion',
        });

        stats.newsSuccess++;
        console.log(`  ✅ Migrated successfully\n`);

      } catch (error: any) {
        stats.newsFailed++;
        const errorMsg = `Failed to migrate "${article.title}": ${error.message}`;
        stats.errors.push(errorMsg);
        console.error(`  ❌ ${errorMsg}\n`);
      }
    }

  } catch (error) {
    console.error('Error fetching news from Notion:', error);
    throw error;
  }
}

async function migrateYouTube(notionClient: EnhancedNotionClient, stats: MigrationStats) {
  console.log('\n🎥 Migrating YouTube Videos from Notion...\n');

  try {
    const allContent = await notionClient.getAllContent();
    const youtubeVideos = allContent.filter(item => item.contentType === 'YouTube Video');

    stats.youtubeTotal = youtubeVideos.length;
    console.log(`Found ${youtubeVideos.length} YouTube videos in Notion\n`);

    for (const video of youtubeVideos) {
      try {
        console.log(`Processing: ${video.title}`);

        // Extract video ID from URL
        const videoId = extractVideoId(video.sourceUrl);
        if (!videoId) {
          console.log(`  ⚠️  Invalid YouTube URL, skipping\n`);
          continue;
        }

        // Check if already exists in Postgres
        const existing = await YouTubeModel.findByVideoId(videoId);
        if (existing) {
          console.log(`  ⏭️  Already exists, skipping\n`);
          continue;
        }

        // Create in Postgres
        await YouTubeModel.create({
          video_id: videoId,
          url: video.sourceUrl,
          title: video.title,
          description: video.description || null,
          channel: video.source || null,
          thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: null,
          published_date: video.publishedDate || null,
          category: video.category || 'Interview',
          tags: [],
          featured: video.featured || false,
          status: video.status === 'Published' ? 'published' : 'draft',
          created_by: 'notion-migration',
        });

        stats.youtubeSuccess++;
        console.log(`  ✅ Migrated successfully\n`);

      } catch (error: any) {
        stats.youtubeFailed++;
        const errorMsg = `Failed to migrate "${video.title}": ${error.message}`;
        stats.errors.push(errorMsg);
        console.error(`  ❌ ${errorMsg}\n`);
      }
    }

  } catch (error) {
    console.error('Error fetching videos from Notion:', error);
    throw error;
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

async function runMigration() {
  console.log('🚀 Starting Notion to Postgres Migration...\n');
  console.log('═'.repeat(60));

  const stats: MigrationStats = {
    newsTotal: 0,
    newsSuccess: 0,
    newsFailed: 0,
    youtubeTotal: 0,
    youtubeSuccess: 0,
    youtubeFailed: 0,
    errors: [],
  };

  try {
    const notionClient = new EnhancedNotionClient();

    // Migrate news articles
    await migrateNews(notionClient, stats);

    // Migrate YouTube videos
    await migrateYouTube(notionClient, stats);

    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('\n📊 Migration Summary:\n');
    console.log('News Articles:');
    console.log(`  Total in Notion: ${stats.newsTotal}`);
    console.log(`  ✅ Successfully migrated: ${stats.newsSuccess}`);
    console.log(`  ❌ Failed: ${stats.newsFailed}`);
    console.log('');
    console.log('YouTube Videos:');
    console.log(`  Total in Notion: ${stats.youtubeTotal}`);
    console.log(`  ✅ Successfully migrated: ${stats.youtubeSuccess}`);
    console.log(`  ❌ Failed: ${stats.youtubeFailed}`);
    console.log('');
    console.log('Overall:');
    console.log(`  ✅ Total successful: ${stats.newsSuccess + stats.youtubeSuccess}`);
    console.log(`  ❌ Total failed: ${stats.newsFailed + stats.youtubeFailed}`);

    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      stats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log('\n✅ Migration completed!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
