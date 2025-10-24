/**
 * TEMPORARY: Database Migration Endpoint
 * This endpoint runs the database schema migration.
 * DELETE THIS FILE AFTER RUNNING THE MIGRATION ONCE.
 */

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST() {
  try {
    console.log('🚀 Starting database migration...');

    // Read the schema file
    const schemaPath = join(process.cwd(), 'src/lib/db/content-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 60) + '...';

      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${preview}`);
        await sql.query(statement);
        results.successful++;
      } catch (error: any) {
        console.error(`❌ Error executing statement: ${error.message}`);
        results.failed++;
        results.errors.push(`Statement ${i + 1}: ${error.message}`);
      }
    }

    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successful: ${results.successful}`);
    console.log(`   ❌ Failed: ${results.failed}`);

    // Verify tables were created
    const tables = await sql.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('news_articles', 'youtube_videos', 'resources', 'static_content')
      ORDER BY table_name
    `);

    console.log('🔍 Verified tables:', tables.rows.map(r => r.table_name));

    return NextResponse.json({
      success: results.failed === 0,
      message: results.failed === 0
        ? '✅ Database migration completed successfully!'
        : '⚠️  Migration completed with errors',
      results: {
        successful: results.successful,
        failed: results.failed,
        total: statements.length,
      },
      tables: tables.rows.map(r => r.table_name),
      errors: results.errors,
    });

  } catch (error: any) {
    console.error('💥 Fatal migration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '❌ Database migration failed',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database Migration Endpoint',
    warning: '⚠️  This is a temporary endpoint. DELETE after running migration.',
    usage: 'Send POST request to run migration',
    note: 'This endpoint should only be called ONCE to set up the database schema',
  });
}
