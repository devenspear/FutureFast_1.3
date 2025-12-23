/**
 * Sync Briefing Cron Job
 *
 * Fetches the latest executive briefing digest from Disruption Radar
 * and stores it locally for display in the "In the News" section.
 *
 * Schedule: Monday 9:00 AM Eastern (1 hour after DR sends emails)
 * Endpoint: GET /api/cron/sync-briefing
 *
 * Environment Variables:
 * - DISRUPTION_RADAR_API_URL: Base URL for the DR API
 * - DISRUPTION_RADAR_API_KEY: API key for authentication
 * - CRON_SECRET: Vercel cron authentication (optional)
 */

import { NextRequest, NextResponse } from 'next/server';
import { BriefingDigestModel } from '@/lib/db/models';

const DR_API_URL = process.env.DISRUPTION_RADAR_API_URL || 'https://disruptionradar.xyz/api/public/briefing-feed';
const DR_API_KEY = process.env.DISRUPTION_RADAR_API_KEY;

interface DRBriefingResponse {
  success: boolean;
  generated: string;
  periodStart: string;
  periodEnd: string;
  periodDays: number;
  analysisCount: number;
  validationScore: number | null;
  isValidated: boolean;
  digest: {
    headline?: string;
    executiveSummary?: string;
    topTrends?: Array<{ trend: string; implication: string }>;
    keyDevelopments?: Array<{ headline: string; significance: string }>;
    companiesWatching?: string[];
    technologiesWatching?: string[];
    strategicInsight?: string | null;
    emergingPatterns?: string[];
  };
  metadata: {
    briefingId: string;
    fullBriefingUrl: string;
    validatedAt: string | null;
    validatorModel: string | null;
    generatorModel: string | null;
    format: string;
    fieldsIncluded: string[];
  };
}

export async function GET(request: NextRequest) {
  // Verify cron authorization (Vercel adds this header)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In production, verify the cron secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.log('[SYNC-BRIEFING] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify API key is configured
  if (!DR_API_KEY) {
    console.error('[SYNC-BRIEFING] DISRUPTION_RADAR_API_KEY not configured');
    return NextResponse.json(
      { error: 'Configuration error: API key not set' },
      { status: 500 }
    );
  }

  console.log('[SYNC-BRIEFING] Starting sync from Disruption Radar...');

  try {
    // Fetch from Disruption Radar API
    const response = await fetch(DR_API_URL, {
      method: 'GET',
      headers: {
        'X-API-Key': DR_API_KEY,
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SYNC-BRIEFING] DR API error:', response.status, errorText);

      // If no new briefing available (404), that's not an error
      if (response.status === 404) {
        console.log('[SYNC-BRIEFING] No new briefing available yet');
        return NextResponse.json({
          success: true,
          message: 'No new briefing available',
          synced: false,
        });
      }

      return NextResponse.json(
        { error: `DR API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data: DRBriefingResponse = await response.json();
    console.log('[SYNC-BRIEFING] Received briefing:', data.metadata?.briefingId);

    // Transform and store the briefing
    const digest = await BriefingDigestModel.upsert({
      source: 'disruption-radar',
      period_start: new Date(data.periodStart),
      period_end: new Date(data.periodEnd),
      period_days: data.periodDays,
      analysis_count: data.analysisCount,
      validation_score: data.validationScore ?? undefined,
      headline: data.digest.headline,
      executive_summary: data.digest.executiveSummary,
      top_trends: data.digest.topTrends,
      key_developments: data.digest.keyDevelopments,
      companies_watching: data.digest.companiesWatching,
      technologies_watching: data.digest.technologiesWatching,
      strategic_insight: data.digest.strategicInsight ?? undefined,
      emerging_patterns: data.digest.emergingPatterns,
      full_briefing_url: data.metadata.fullBriefingUrl,
      source_generated_at: new Date(data.generated),
      source_briefing_id: data.metadata.briefingId,
    });

    console.log('[SYNC-BRIEFING] Stored briefing:', digest.id);

    return NextResponse.json({
      success: true,
      message: 'Briefing synced successfully',
      synced: true,
      briefingId: digest.id,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      analysisCount: data.analysisCount,
      validationScore: data.validationScore,
    });

  } catch (error) {
    console.error('[SYNC-BRIEFING] Sync failed:', error);
    return NextResponse.json(
      {
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual trigger
export async function POST(request: NextRequest) {
  // For manual triggers, validate admin auth
  const authHeader = request.headers.get('authorization');

  // Simple bearer token check (you could use JWT or session auth instead)
  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delegate to GET handler
  return GET(request);
}
