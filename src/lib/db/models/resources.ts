/**
 * Resources Model
 * Full CRUD operations for resources table
 */

import { sql } from '../client';
import type {
  Resource,
  CreateResource,
  UpdateResource,
  ResourceFilters,
} from '../types';

export class ResourceModel {
  /**
   * Create a new resource
   */
  static async create(data: CreateResource): Promise<Resource> {
    // Convert dates to ISO strings for PostgreSQL
    const publishedDate = data.published_date instanceof Date
      ? data.published_date.toISOString()
      : data.published_date;

    // Convert tags array to PostgreSQL array format
    const tags = data.tags ? JSON.stringify(data.tags) : null;

    const result = await sql`
      INSERT INTO resources (
        title,
        description,
        file_url,
        file_type,
        file_size,
        thumbnail_url,
        cover_image_url,
        category,
        tags,
        author,
        source,
        published_date,
        featured,
        status,
        created_by
      ) VALUES (
        ${data.title},
        ${data.description || null},
        ${data.file_url || null},
        ${data.file_type || null},
        ${data.file_size || null},
        ${data.thumbnail_url || null},
        ${data.cover_image_url || null},
        ${data.category || null},
        ${tags},
        ${data.author || null},
        ${data.source || null},
        ${publishedDate || null},
        ${data.featured || false},
        ${data.status || 'published'},
        ${data.created_by || 'admin'}
      )
      RETURNING *
    `;

    return result.rows[0] as Resource;
  }

  /**
   * Find all resources with optional filters
   */
  static async findAll(filters: ResourceFilters = {}): Promise<Resource[]> {
    const {
      status = 'published',
      featured,
      category,
      file_type,
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

    if (file_type) {
      paramCount++;
      conditions.push(`file_type = $${paramCount}`);
      values.push(file_type);
    }

    if (search) {
      paramCount++;
      conditions.push(`(title ILIKE $${paramCount} OR author ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    paramCount++;
    values.push(limit);
    const limitParam = paramCount;

    paramCount++;
    values.push(offset);
    const offsetParam = paramCount;

    const queryText = `
      SELECT * FROM resources
      WHERE ${conditions.join(' AND ')}
      ORDER BY
        CASE WHEN published_date IS NOT NULL THEN published_date ELSE created_at END DESC
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `;

    const result = await sql.query(queryText, values);
    return result.rows as Resource[];
  }

  /**
   * Find a single resource by ID
   */
  static async findById(id: string): Promise<Resource | null> {
    const result = await sql`
      SELECT * FROM resources
      WHERE id = ${id}
    `;

    return result.rows[0] as Resource || null;
  }

  /**
   * Find resource by file URL (for duplicate checking)
   */
  static async findByFileUrl(fileUrl: string): Promise<Resource | null> {
    const result = await sql`
      SELECT * FROM resources
      WHERE file_url = ${fileUrl}
    `;

    return result.rows[0] as Resource || null;
  }

  /**
   * Update a resource
   */
  static async update(id: string, data: UpdateResource): Promise<Resource | null> {
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
      `UPDATE resources
       SET ${updates.join(', ')}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    return result.rows[0] as Resource || null;
  }

  /**
   * Delete a resource (soft delete by setting status to archived)
   */
  static async delete(id: string): Promise<boolean> {
    const result = await sql`
      UPDATE resources
      SET status = 'archived'
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  }

  /**
   * Hard delete a resource (permanent)
   */
  static async hardDelete(id: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM resources
      WHERE id = ${id}
      RETURNING id
    `;

    return result.rows.length > 0;
  }

  /**
   * Get featured resources
   */
  static async getFeatured(limit: number = 10): Promise<Resource[]> {
    return this.findAll({ status: 'published', featured: true, limit });
  }

  /**
   * Get resources by category
   */
  static async getByCategory(category: string, limit: number = 20): Promise<Resource[]> {
    return this.findAll({ status: 'published', category, limit });
  }

  /**
   * Get resources by file type
   */
  static async getByFileType(fileType: string, limit: number = 20): Promise<Resource[]> {
    return this.findAll({ status: 'published', file_type: fileType, limit });
  }

  /**
   * Increment download count
   */
  static async incrementDownloadCount(id: string): Promise<Resource | null> {
    const result = await sql`
      UPDATE resources
      SET
        download_count = download_count + 1,
        last_downloaded_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    return result.rows[0] as Resource || null;
  }

  /**
   * Get total count with filters
   */
  static async count(filters: ResourceFilters = {}): Promise<number> {
    const {
      status = 'published',
      featured,
      category,
      file_type,
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

    if (file_type) {
      paramCount++;
      conditions.push(`file_type = $${paramCount}`);
      values.push(file_type);
    }

    const queryText = `
      SELECT COUNT(*) as count FROM resources
      WHERE ${conditions.join(' AND ')}
    `;

    const result = await sql.query(queryText, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Search resources with full-text search
   */
  static async search(searchTerm: string, limit: number = 20): Promise<Resource[]> {
    const result = await sql`
      SELECT *
      FROM resources
      WHERE status = 'published'
        AND to_tsvector('english', title || ' ' || COALESCE(description, ''))
        @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY
        CASE WHEN published_date IS NOT NULL THEN published_date ELSE created_at END DESC
      LIMIT ${limit}
    `;

    return result.rows as Resource[];
  }

  /**
   * Get most downloaded resources
   */
  static async getMostDownloaded(limit: number = 10): Promise<Resource[]> {
    const result = await sql`
      SELECT * FROM resources
      WHERE status = 'published'
      ORDER BY download_count DESC, created_at DESC
      LIMIT ${limit}
    `;

    return result.rows as Resource[];
  }

  /**
   * Get recent resources (last 30 days)
   */
  static async getRecent(limit: number = 10): Promise<Resource[]> {
    const result = await sql`
      SELECT * FROM resources
      WHERE status = 'published'
        AND created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result.rows as Resource[];
  }
}

export default ResourceModel;
