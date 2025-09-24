import { NextRequest, NextResponse } from 'next/server';
import EnhancedNotionClient from '../../../../../lib/enhanced-notion-client';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching date extraction dashboard data...');

    const notionClient = new EnhancedNotionClient();

    // Get enhanced processing statistics
    const stats = await notionClient.getEnhancedProcessingStats();

    // Get records needing review
    const reviewRecords = await notionClient.getRecordsNeedingReview();

    // Calculate additional metrics
    const totalWithDates = stats.highConfidenceExtractions + stats.mediumConfidenceExtractions + stats.lowConfidenceExtractions;
    const extractionSuccessRate = totalWithDates > 0 ? ((stats.highConfidenceExtractions + stats.mediumConfidenceExtractions) / totalWithDates * 100).toFixed(1) : '0';

    // Group review records by priority for detailed view
    const reviewSummary = {
      total: reviewRecords.length,
      byPriority: {
        Critical: reviewRecords.filter(r => r.reviewPriority === 'Critical').length,
        High: reviewRecords.filter(r => r.reviewPriority === 'High').length,
        Standard: reviewRecords.filter(r => r.reviewPriority === 'Standard').length,
        Low: reviewRecords.filter(r => r.reviewPriority === 'Low').length,
      },
      byExtractionMethod: {} as { [key: string]: number },
      avgConfidence: 0
    };

    // Calculate review records by extraction method and average confidence
    let totalConfidence = 0;
    let confidenceCount = 0;

    reviewRecords.forEach(record => {
      if (record.dateExtractionMethod) {
        reviewSummary.byExtractionMethod[record.dateExtractionMethod] =
          (reviewSummary.byExtractionMethod[record.dateExtractionMethod] || 0) + 1;
      }

      if (record.dateConfidence !== undefined) {
        totalConfidence += record.dateConfidence;
        confidenceCount++;
      }
    });

    reviewSummary.avgConfidence = confidenceCount > 0 ?
      Math.round(totalConfidence / confidenceCount) : 0;

    // Recent problematic sources
    const problematicSources = reviewRecords
      .filter(r => r.dateConfidence !== undefined && r.dateConfidence < 30)
      .reduce((sources: { [key: string]: number }, record) => {
        if (record.sourceUrl) {
          const domain = new URL(record.sourceUrl).hostname.replace('www.', '');
          sources[domain] = (sources[domain] || 0) + 1;
        }
        return sources;
      }, {});

    const response = {
      success: true,
      data: {
        overview: {
          totalRecords: stats.totalRecords,
          processedRecords: stats.processedRecords,
          needingReview: stats.needingReview,
          extractionSuccessRate: extractionSuccessRate + '%'
        },
        confidence: {
          high: stats.highConfidenceExtractions,
          medium: stats.mediumConfidenceExtractions,
          low: stats.lowConfidenceExtractions,
          distribution: {
            'High (85-100%)': stats.highConfidenceExtractions,
            'Medium (60-84%)': stats.mediumConfidenceExtractions,
            'Low (1-59%)': stats.lowConfidenceExtractions,
            'None (0%)': stats.totalRecords - totalWithDates
          }
        },
        extractionMethods: stats.byExtractionMethod,
        reviewQueue: {
          ...stats.reviewQueue,
          details: reviewSummary
        },
        problematicSources,
        recentReviewItems: reviewRecords.slice(0, 10).map(record => ({
          id: record.id,
          title: record.title,
          sourceUrl: record.sourceUrl,
          confidence: record.dateConfidence,
          method: record.dateExtractionMethod,
          priority: record.reviewPriority,
          notes: record.dateExtractionNotes,
          extractedDate: record.publishedDate
        }))
      },
      timestamp: new Date().toISOString()
    };

    console.log('✅ Date extraction dashboard data compiled');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Failed to fetch dashboard data:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, recordId, reviewedBy, finalDate } = body;

    if (!action || !recordId) {
      return NextResponse.json({
        success: false,
        error: 'Action and recordId are required'
      }, { status: 400 });
    }

    const notionClient = new EnhancedNotionClient();

    switch (action) {
      case 'mark_reviewed':
        if (!reviewedBy) {
          return NextResponse.json({
            success: false,
            error: 'reviewedBy is required for mark_reviewed action'
          }, { status: 400 });
        }

        await notionClient.markAsReviewed(recordId, reviewedBy, finalDate);

        return NextResponse.json({
          success: true,
          message: 'Record marked as reviewed',
          recordId,
          reviewedBy,
          finalDate: finalDate || 'No date override'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Dashboard action failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}