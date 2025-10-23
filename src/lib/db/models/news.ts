/**
 * News Articles Model
 * Full CRUD operations for news_articles table
 */

import { sql } from '../client';
import type {
  NewsArticle,
  CreateNewsArticle,
  UpdateNewsArticle,
  NewsFilters,
} from '../types';

export class NewsModel {
  /**
   * Create a new news article
   */
  static async create(data: CreateNewsArticle): Promise<NewsArticle> {
    // Convert dates to ISO strings for PostgreSQL
    const publishedDate = data.published_date instanceof Date
      ? data.published_date.toISOString()
      : data.published_date;

    // Convert tags array to PostgreSQL array format
    const tags = data.tags ? JSON.stringify(data.tags) : null;

    const result = await sql`
      INSERT INTO news_articles (
        title,
        url,
        source,
        summary,
        published_date,
        date_confidence,
        date_extraction_method,
        date_extraction_notes,
        category,
        tags,
        icon,
        featured,
        status,
        needs_review,
        review_priority,
        created_by,
        processed_by,
        processing_notes
      ) VALUES (
        ${data.title},
        ${data.url},
        ${data.source},
        ${data.summary || null},
        ${publishedDate},
        ${data.date_confidence || null},
        ${data.date_extraction_method || null},
        ${data.date_extraction_notes || null},
        ${data.category || null},
        ${tags},
        ${data.icon || '📰'},
        ${data.featured || false},
        ${data.status || 'published'},
        ${data.needs_review || false},
        ${data.review_priority || null},
        ${data.created_by || 'admin'},
        ${data.processed_by || 'AI-ContentExtractor'},
        ${data.processing_notes || null}
      )
      RETURNING *
    `;

    return result.rows[0] as NewsArticle;
  }

  /**
   * Find all news articles with optional filters
   */
  static async findAll(filters: NewsFilters = {}): Promise<NewsArticle[]> {
    const {
      status = 'published',
      featured,
      category,
      needs_review,
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

    if (needs_review !== undefined) {
      paramCount++;
      conditions.push(`needs_review = $${paramCount}`);
      values.push(needs_review);
    }

    if (search) {
      paramCount++;
      conditions.push(`(title ILIKE $${paramCount} OR source ILIKE $${paramCount} OR summary ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    paramCount++;
    values.push(limit);
    const limitParam = paramCount;

    paramCount++;
    values.push(offset);
    const offsetParam = paramCount;

    const queryText = `
      SELECT * FROM news_articles
      WHERE ${conditions.join(' AND ')}
      ORDER BY published_date DESC
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `;

    const result = await sql.query(queryText, values);
    return result.rows as NewsArticle[];
  }

  /**
   * Find a single article by ID
   */
  static async findById(id: string): Promise<NewsArticle | null> {
    const result = await sql`
      SELECT * FROM news_articles
      WHERE id = ${id}
    `;

    return result.rows[0] as NewsArticle || null;
  }

  /**
   * Find article by URL (for duplicate checking)
   */
  static async findByUrl(url: string): Promise<NewsArticle | null> {
    const result = await sql`
      SELECT * FROM news_articles
      WHERE url = ${url}
    `;

    return result.rows[0] as NewsArticle || null;
  }

  /**
   * Update an article
   */
  static async update(id: string, data: UpdateNewsArticle): Promise<NewsArticle | null> {
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
      `UPDATE news_articles
       SET ${updates.join(', ')}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    return result.rows[0] as NewsArticle || null;
  }

  /**
   * Delete an article (soft delete by setting status to archived)
   */
  static async delete(id: string): Promise<boolean> {
    const result = await sql`
      UPDATE news_articles
      SET status = 'archived'
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  }

  /**
   * Hard delete an article (permanent)
   */
  static async hardDelete(id: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM news_articles
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  }

  /**
   * Get featured articles
   */
  static async getFeatured(limit: number = 10): Promise<NewsArticle[]> {
    return this.findAll({ status: 'published', featured: true, limit });
  }

  /**
   * Get articles by category
   */
  static async getByCategory(category: string, limit: number = 20): Promise<NewsArticle[]> {
    return this.findAll({ status: 'published', category, limit });
  }

  /**
   * Get articles needing review
   */
  static async getNeedingReview(): Promise<NewsArticle[]> {
    const result = await sql`
      SELECT * FROM news_articles
      WHERE needs_review = true
        AND status != 'archived'
      ORDER BY
        CASE review_priority
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Standard' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END,
        created_at DESC
    `;

    return result.rows as NewsArticle[];
  }

  /**
   * Mark article as reviewed
   */
  static async markReviewed(id: string, reviewedBy: string = 'admin'): Promise<NewsArticle | null> {
    const result = await sql`
      UPDATE news_articles
      SET
        needs_review = false,
        reviewed_at = CURRENT_TIMESTAMP,
        reviewed_by = ${reviewedBy}
      WHERE id = ${id}
      RETURNING *
    `;

    return result.rows[0] as NewsArticle || null;
  }

  /**
   * Get total count with filters
   */
  static async count(filters: NewsFilters = {}): Promise<number> {
    const {
      status = 'published',
      featured,
      category,
      needs_review,
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

    if (needs_review !== undefined) {
      paramCount++;
      conditions.push(`needs_review = $${paramCount}`);
      values.push(needs_review);
    }

    const queryText = `
      SELECT COUNT(*) as count FROM news_articles
      WHERE ${conditions.join(' AND ')}
    `;

    const result = await sql.query(queryText, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Search articles with full-text search
   */
  static async search(searchTerm: string, limit: number = 20): Promise<NewsArticle[]> {
    const result = await sql`
      SELECT *
      FROM news_articles
      WHERE status = 'published'
        AND to_tsvector('english', title || ' ' || COALESCE(summary, ''))
        @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY published_date DESC
      LIMIT ${limit}
    `;

    return result.rows as NewsArticle[];
  }
}

export default NewsModel;
