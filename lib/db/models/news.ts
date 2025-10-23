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
        ${data.published_date},
        ${data.date_confidence || null},
        ${data.date_extraction_method || null},
        ${data.date_extraction_notes || null},
        ${data.category || null},
        ${data.tags || null},
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

    let query = sql`
      SELECT * FROM news_articles
      WHERE status = ${status}
    `;

    if (featured !== undefined) {
      query = sql`${query} AND featured = ${featured}`;
    }

    if (category) {
      query = sql`${query} AND category = ${category}`;
    }

    if (needs_review !== undefined) {
      query = sql`${query} AND needs_review = ${needs_review}`;
    }

    if (search) {
      query = sql`${query} AND (
        title ILIKE ${`%${search}%`} OR
        source ILIKE ${`%${search}%`} OR
        summary ILIKE ${`%${search}%`}
      )`;
    }

    query = sql`${query}
      ORDER BY published_date DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const result = await query;
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

    let query = sql`
      SELECT COUNT(*) as count FROM news_articles
      WHERE status = ${status}
    `;

    if (featured !== undefined) {
      query = sql`${query} AND featured = ${featured}`;
    }

    if (category) {
      query = sql`${query} AND category = ${category}`;
    }

    if (needs_review !== undefined) {
      query = sql`${query} AND needs_review = ${needs_review}`;
    }

    const result = await query;
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
