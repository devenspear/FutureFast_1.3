/**
 * Database Client
 * Centralized database connection and query utilities
 */

import { sql } from '@vercel/postgres';

export { sql };

/**
 * Generic query helper with error handling
 */
export async function query<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await sql.query(queryText, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single query and return first row or null
 */
export async function queryOne<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T | null> {
  const results = await query<T>(queryText, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Health check - verify database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getStats() {
  try {
    const [newsCount, videosCount, resourcesCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM news_articles WHERE status = 'published'`,
      sql`SELECT COUNT(*) as count FROM youtube_videos WHERE status = 'published'`,
      sql`SELECT COUNT(*) as count FROM resources WHERE status = 'published'`,
    ]);

    return {
      news: parseInt(newsCount.rows[0].count),
      videos: parseInt(videosCount.rows[0].count),
      resources: parseInt(resourcesCount.rows[0].count),
      total: parseInt(newsCount.rows[0].count) +
             parseInt(videosCount.rows[0].count) +
             parseInt(resourcesCount.rows[0].count),
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return { news: 0, videos: 0, resources: 0, total: 0 };
  }
}
