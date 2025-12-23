/**
 * Briefing Digest API
 *
 * Returns the latest synced executive briefing digest for display
 * in the "In the News" section.
 *
 * Endpoint: GET /api/briefing-digest
 */

import { NextResponse } from 'next/server';
import { BriefingDigestModel } from '@/lib/db/models';

export async function GET() {
  try {
    // Get the latest briefing
    let briefing = await BriefingDigestModel.getLatest();

    // If no current briefing, try to get the previous one
    if (!briefing) {
      briefing = await BriefingDigestModel.getPrevious();
    }

    if (!briefing) {
      return NextResponse.json({
        success: false,
        message: 'No briefing available',
        briefing: null,
      });
    }

    // Format dates for frontend
    const formattedBriefing = {
      id: briefing.id,
      source: briefing.source,
      periodStart: briefing.period_start.toISOString().split('T')[0],
      periodEnd: briefing.period_end.toISOString().split('T')[0],
      periodDays: briefing.period_days,
      analysisCount: briefing.analysis_count,
      validationScore: briefing.validation_score,
      headline: briefing.headline,
      executiveSummary: briefing.executive_summary,
      topTrends: briefing.top_trends,
      keyDevelopments: briefing.key_developments,
      companiesWatching: briefing.companies_watching,
      technologiesWatching: briefing.technologies_watching,
      strategicInsight: briefing.strategic_insight,
      emergingPatterns: briefing.emerging_patterns,
      generatedAt: briefing.source_generated_at.toISOString(),
      syncedAt: briefing.synced_at.toISOString(),
    };

    return NextResponse.json({
      success: true,
      briefing: formattedBriefing,
    });

  } catch (error) {
    console.error('[BRIEFING-DIGEST] Error fetching briefing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch briefing',
        briefing: null,
      },
      { status: 500 }
    );
  }
}
