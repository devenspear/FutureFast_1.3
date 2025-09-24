import { NextRequest, NextResponse } from 'next/server';
import { generateNewsMetadata } from '../../../../lib/openai-utils';
import { EnhancedDateExtractor } from '../../../../lib/enhanced-date-extractor';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing enhanced date extraction for: ${url}`);

    const dateExtractor = new EnhancedDateExtractor();

    // Use enhanced date extraction
    const dateResult = await dateExtractor.extractDateWithConfidence(url);

    // Also try legacy method for comparison
    let legacyResult = null;
    try {
      legacyResult = await generateNewsMetadata(url);
    } catch (error) {
      console.warn('Legacy method failed:', error);
    }

    return NextResponse.json({
      success: true,
      url,
      enhanced: {
        publishedDate: dateResult.publishedDate,
        confidence: dateResult.confidence,
        method: dateResult.method,
        needsReview: dateResult.needsReview,
        notes: dateResult.extractionNotes,
        confidenceLevel: dateExtractor.getConfidenceDescription(dateResult.confidence),
        rawData: dateResult.rawData
      },
      legacy: legacyResult ? {
        publishedDate: legacyResult.publishedDate,
        title: legacyResult.title,
        source: legacyResult.source
      } : 'Failed',
      comparison: {
        enhancedConfidence: dateResult.confidence,
        recommendedAction: dateResult.needsReview ? 'Human review required' : 'Auto-approved',
        extractionMethod: dateResult.method
      },
      message: 'Enhanced date extraction test completed'
    });

  } catch (error) {
    console.error('❌ Enhanced test date extraction failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Enhanced date extraction test failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Date Extraction Test Endpoint',
    usage: 'POST with { "url": "https://example.com/article" }',
    features: [
      'Multi-strategy date extraction with confidence scoring',
      'Bot detection bypass with rotating user agents',
      'URL pattern analysis for known domains',
      'Enhanced meta tag and JSON-LD parsing',
      'AI-powered content analysis with fallback',
      'Human review flagging system',
      'Confidence-based processing decisions',
      'Source-specific priority handling'
    ],
    confidenceLevels: {
      'High (85-100%)': 'Auto-approved, no review needed',
      'Medium (60-84%)': 'Auto-approved with optional review',
      'Low (30-59%)': 'Flagged for human review',
      'None (0-29%)': 'Mandatory human review'
    },
    extractionMethods: [
      'meta-tags: HTML meta tags and structured data',
      'json-ld: JSON-LD structured data',
      'url-pattern: Date extraction from URL structure',
      'ai-content: AI analysis of content',
      'current-date: Fallback to current date with review flag'
    ]
  });
} 