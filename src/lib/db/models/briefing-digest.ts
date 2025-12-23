/**
 * Briefing Digest Model
 * Stores and retrieves executive briefing digests from Disruption Radar
 */

import { sql } from '../client';
import type {
  BriefingDigest,
  CreateBriefingDigest,
  TrendSummary,
  DevelopmentSummary,
} from '../types';

export class BriefingDigestModel {
  /**
   * Upsert a briefing digest (insert or update based on source + period)
   */
  static async upsert(data: CreateBriefingDigest): Promise<BriefingDigest> {
    const periodStart = data.period_start instanceof Date
      ? data.period_start.toISOString()
      : data.period_start;

    const periodEnd = data.period_end instanceof Date
      ? data.period_end.toISOString()
      : data.period_end;

    const sourceGeneratedAt = data.source_generated_at instanceof Date
      ? data.source_generated_at.toISOString()
      : data.source_generated_at;

    // Check for existing record
    const existing = await sql`
      SELECT id FROM briefing_digests
      WHERE source = ${data.source || 'disruption-radar'}
        AND period_start::date = ${periodStart}::date
        AND period_end::date = ${periodEnd}::date
    `;

    if (existing.rows.length > 0) {
      // Update existing record
      const result = await sql`
        UPDATE briefing_digests
        SET
          period_days = ${data.period_days},
          analysis_count = ${data.analysis_count},
          validation_score = ${data.validation_score || null},
          headline = ${data.headline || null},
          executive_summary = ${data.executive_summary || null},
          top_trends = ${data.top_trends ? JSON.stringify(data.top_trends) : null}::jsonb,
          key_developments = ${data.key_developments ? JSON.stringify(data.key_developments) : null}::jsonb,
          companies_watching = ${data.companies_watching ? `{${data.companies_watching.join(',')}}` : null},
          technologies_watching = ${data.technologies_watching ? `{${data.technologies_watching.join(',')}}` : null},
          strategic_insight = ${data.strategic_insight || null},
          emerging_patterns = ${data.emerging_patterns ? `{${data.emerging_patterns.join(',')}}` : null},
          full_briefing_url = ${data.full_briefing_url || null},
          source_generated_at = ${sourceGeneratedAt},
          source_briefing_id = ${data.source_briefing_id || null},
          synced_at = NOW(),
          updated_at = NOW()
        WHERE id = ${existing.rows[0].id}
        RETURNING *
      `;
      return this.parseRow(result.rows[0]);
    }

    // Insert new record
    const result = await sql`
      INSERT INTO briefing_digests (
        source,
        period_start,
        period_end,
        period_days,
        analysis_count,
        validation_score,
        headline,
        executive_summary,
        top_trends,
        key_developments,
        companies_watching,
        technologies_watching,
        strategic_insight,
        emerging_patterns,
        full_briefing_url,
        source_generated_at,
        source_briefing_id,
        synced_at
      ) VALUES (
        ${data.source || 'disruption-radar'},
        ${periodStart},
        ${periodEnd},
        ${data.period_days},
        ${data.analysis_count},
        ${data.validation_score || null},
        ${data.headline || null},
        ${data.executive_summary || null},
        ${data.top_trends ? JSON.stringify(data.top_trends) : null}::jsonb,
        ${data.key_developments ? JSON.stringify(data.key_developments) : null}::jsonb,
        ${data.companies_watching ? `{${data.companies_watching.join(',')}}` : null},
        ${data.technologies_watching ? `{${data.technologies_watching.join(',')}}` : null},
        ${data.strategic_insight || null},
        ${data.emerging_patterns ? `{${data.emerging_patterns.join(',')}}` : null},
        ${data.full_briefing_url || null},
        ${sourceGeneratedAt},
        ${data.source_briefing_id || null},
        NOW()
      )
      RETURNING *
    `;

    return this.parseRow(result.rows[0]);
  }

  /**
   * Get the latest briefing digest
   */
  static async getLatest(): Promise<BriefingDigest | null> {
    const result = await sql`
      SELECT * FROM briefing_digests
      ORDER BY source_generated_at DESC
      LIMIT 1
    `;

    if (result.rows.length === 0) return null;
    return this.parseRow(result.rows[0]);
  }

  /**
   * Get briefing by ID
   */
  static async findById(id: string): Promise<BriefingDigest | null> {
    const result = await sql`
      SELECT * FROM briefing_digests
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) return null;
    return this.parseRow(result.rows[0]);
  }

  /**
   * Get all briefings (for history)
   */
  static async findAll(limit: number = 52): Promise<BriefingDigest[]> {
    const result = await sql`
      SELECT * FROM briefing_digests
      ORDER BY source_generated_at DESC
      LIMIT ${limit}
    `;

    return result.rows.map(row => this.parseRow(row));
  }

  /**
   * Get the previous week's briefing (for fallback)
   */
  static async getPrevious(): Promise<BriefingDigest | null> {
    const result = await sql`
      SELECT * FROM briefing_digests
      ORDER BY source_generated_at DESC
      OFFSET 1
      LIMIT 1
    `;

    if (result.rows.length === 0) return null;
    return this.parseRow(result.rows[0]);
  }

  /**
   * Parse a database row into a BriefingDigest
   */
  private static parseRow(row: any): BriefingDigest {
    return {
      id: row.id,
      source: row.source,
      period_start: new Date(row.period_start),
      period_end: new Date(row.period_end),
      period_days: row.period_days,
      analysis_count: row.analysis_count,
      validation_score: row.validation_score,
      headline: row.headline,
      executive_summary: row.executive_summary,
      top_trends: row.top_trends as TrendSummary[] | null,
      key_developments: row.key_developments as DevelopmentSummary[] | null,
      companies_watching: row.companies_watching,
      technologies_watching: row.technologies_watching,
      strategic_insight: row.strategic_insight,
      emerging_patterns: row.emerging_patterns,
      full_briefing_url: row.full_briefing_url,
      source_generated_at: new Date(row.source_generated_at),
      source_briefing_id: row.source_briefing_id,
      synced_at: new Date(row.synced_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}

export default BriefingDigestModel;
