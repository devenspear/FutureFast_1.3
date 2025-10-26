/**
 * YouTube Videos Model
 * Full CRUD operations for youtube_videos table
 */

import { sql } from '../client';
import type {
  YouTubeVideo,
  CreateYouTubeVideo,
  UpdateYouTubeVideo,
  YouTubeFilters,
} from '../types';

export class YouTubeModel {
  /**
   * Create a new YouTube video
   */
  static async create(data: CreateYouTubeVideo): Promise<YouTubeVideo> {
    // Convert dates to ISO strings for PostgreSQL
    const publishedDate = data.published_date instanceof Date
      ? data.published_date.toISOString()
      : data.published_date;

    // Convert tags array to PostgreSQL array format
    const tags = data.tags ? JSON.stringify(data.tags) : null;

    const result = await sql`
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
        ${data.video_id},
        ${data.url},
        ${data.title},
        ${data.description || null},
        ${data.channel || null},
        ${data.thumbnail_url || null},
        ${data.duration || null},
        ${publishedDate || null},
        ${data.category || null},
        ${tags},
        ${data.featured || false},
        ${data.status || 'published'},
        ${data.created_by || 'admin'}
      )
      RETURNING *
    `;

    return result.rows[0] as YouTubeVideo;
  }

  /**
   * Find all videos with optional filters
   */
  static async findAll(filters: YouTubeFilters = {}): Promise<YouTubeVideo[]> {
    const {
      status = 'published',
      featured,
      category,
      limit = 100,
      offset = 0,
      search,
    } = filters;

    const conditions: string[] = ['status = $1'];
    const values: any[] = [status];
    let paramCount = 1;

    if (featured !== undefined) {
      paramCount++;
      conditions.push(`featured = $${paramCount}`);
      values.push(featured);
    }

    if (category) {
      paramCount++;
      conditions.push(`category = $${paramCount}`);
      values.push(category);
    }

    if (search) {
      paramCount++;
      conditions.push(`(title ILIKE $${paramCount} OR channel ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    paramCount++;
    values.push(limit);
    const limitParam = paramCount;

    paramCount++;
    values.push(offset);
    const offsetParam = paramCount;

    const queryText = `
      SELECT * FROM youtube_videos
      WHERE ${conditions.join(' AND ')}
      ORDER BY
        CASE WHEN published_date IS NOT NULL THEN published_date ELSE created_at END DESC
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `;

    const result = await sql.query(queryText, values);
    return result.rows as YouTubeVideo[];
  }

  /**
   * Find a single video by ID
   */
  static async findById(id: string): Promise<YouTubeVideo | null> {
    const result = await sql`
      SELECT * FROM youtube_videos
      WHERE id = ${id}
    `;

    return result.rows[0] as YouTubeVideo || null;
  }

  /**
   * Find video by video_id (YouTube video ID)
   */
  static async findByVideoId(videoId: string): Promise<YouTubeVideo | null> {
    const result = await sql`
      SELECT * FROM youtube_videos
      WHERE video_id = ${videoId}
    `;

    return result.rows[0] as YouTubeVideo || null;
  }

  /**
   * Find video by URL (for duplicate checking)
   */
  static async findByUrl(url: string): Promise<YouTubeVideo | null> {
    const result = await sql`
      SELECT * FROM youtube_videos
      WHERE url = ${url}
    `;

    return result.rows[0] as YouTubeVideo || null;
  }

  /**
   * Update a video
   */
  static async update(id: string, data: UpdateYouTubeVideo): Promise<YouTubeVideo | null> {
    const updates: string[] = [];
    const values: any[] = [];

    // Build dynamic SET clause
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return this.findById(id);
    }

    // Add id to values
    values.push(id);

    const result = await sql.query(
      `UPDATE youtube_videos
       SET ${updates.join(', ')}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    return result.rows[0] as YouTubeVideo || null;
  }

  /**
   * Delete a video (soft delete by setting status to archived)
   */
  static async delete(id: string): Promise<boolean> {
    const result = await sql`
      UPDATE youtube_videos
      SET status = 'archived'
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  }

  /**
   * Hard delete a video (permanent)
   */
  static async hardDelete(id: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM youtube_videos
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  }

  /**
   * Get featured videos
   */
  static async getFeatured(limit: number = 10): Promise<YouTubeVideo[]> {
    return this.findAll({ status: 'published', featured: true, limit });
  }

  /**
   * Get videos by category
   */
  static async getByCategory(category: string, limit: number = 20): Promise<YouTubeVideo[]> {
    return this.findAll({ status: 'published', category, limit });
  }

  /**
   * Increment view count
   */
  static async incrementViewCount(id: string): Promise<YouTubeVideo | null> {
    const result = await sql`
      UPDATE youtube_videos
      SET
        view_count = view_count + 1,
        last_viewed_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    return result.rows[0] as YouTubeVideo || null;
  }

  /**
   * Get total count with filters
   */
  static async count(filters: YouTubeFilters = {}): Promise<number> {
    const {
      status = 'published',
      featured,
      category,
    } = filters;

    const conditions: string[] = ['status = $1'];
    const values: any[] = [status];
    let paramCount = 1;

    if (featured !== undefined) {
      paramCount++;
      conditions.push(`featured = $${paramCount}`);
      values.push(featured);
    }

    if (category) {
      paramCount++;
      conditions.push(`category = $${paramCount}`);
      values.push(category);
    }

    const queryText = `
      SELECT COUNT(*) as count FROM youtube_videos
      WHERE ${conditions.join(' AND ')}
    `;

    const result = await sql.query(queryText, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Search videos with full-text search
   */
  static async search(searchTerm: string, limit: number = 20): Promise<YouTubeVideo[]> {
    const result = await sql`
      SELECT *
      FROM youtube_videos
      WHERE status = 'published'
        AND to_tsvector('english', title || ' ' || COALESCE(description, ''))
        @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY
        CASE WHEN published_date IS NOT NULL THEN published_date ELSE created_at END DESC
      LIMIT ${limit}
    `;

    return result.rows as YouTubeVideo[];
  }

  /**
   * Get most viewed videos
   */
  static async getMostViewed(limit: number = 10): Promise<YouTubeVideo[]> {
    const result = await sql`
      SELECT * FROM youtube_videos
      WHERE status = 'published'
      ORDER BY view_count DESC, created_at DESC
      LIMIT ${limit}
    `;

    return result.rows as YouTubeVideo[];
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  static extractVideoId(url: string): string | null {
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
}

export default YouTubeModel;
