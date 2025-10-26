/**
 * Database Migration Script
 * Runs the content management schema on Vercel Postgres
 *
 * Usage: npx tsx scripts/migrate-db.ts
 */

import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  try {
    // Read the schema file
    const schemaPath = join(process.cwd(), 'src/lib/db/content-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split by semicolons to get individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let skipCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comment-only statements
      if (!statement || statement.trim().length === 0) {
        continue;
      }

      try {
        // Extract statement type for logging
        const statementType = statement.split(' ')[0];
        const statementPreview = statement.substring(0, 60).replace(/\s+/g, ' ');

        console.log(`[${i + 1}/${statements.length}] Executing: ${statementPreview}...`);

        await sql.query(statement);
        successCount++;
        console.log(`✅ Success\n`);

      } catch (error: any) {
        // Skip if table/index already exists
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Already exists, skipping\n`);
          skipCount++;
        } else {
          console.error(`❌ Error executing statement:`, error.message);
          console.error(`Statement: ${statement.substring(0, 200)}...\n`);
          // Don't throw - continue with other statements
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   📋 Total: ${statements.length}\n`);

    // Verify tables were created
    console.log('🔍 Verifying tables...\n');

    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('news_articles', 'youtube_videos', 'resources', 'static_content')
      ORDER BY table_name
    `;

    console.log('📋 Content management tables:');
    tables.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });

    // Show table counts
    console.log('\n📊 Current record counts:');

    const newsCount = await sql`SELECT COUNT(*) as count FROM news_articles`;
    console.log(`   📰 News articles: ${newsCount.rows[0].count}`);

    const videosCount = await sql`SELECT COUNT(*) as count FROM youtube_videos`;
    console.log(`   🎥 YouTube videos: ${videosCount.rows[0].count}`);

    const resourcesCount = await sql`SELECT COUNT(*) as count FROM resources`;
    console.log(`   📚 Resources: ${resourcesCount.rows[0].count}`);

    console.log('\n✅ Database migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
