/**
 * Admin API - News Articles CRUD
 * POST   /api/admin/db/news - Create new article
 * GET    /api/admin/db/news - List articles with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { NewsModel } from '@/lib/db/models';
import { generateNewsMetadata } from '@/lib/openai-utils';
import { EnhancedDateExtractor } from '@/lib/enhanced-date-extractor';

/**
 * GET - List all news articles with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined;
    const category = searchParams.get('category') || undefined;
    const needs_review = searchParams.get('needs_review') === 'true' ? true : undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || undefined;

    // Fetch articles
    const articles = await NewsModel.findAll({
      status,
      featured,
      category,
      needs_review,
      limit,
      offset,
      search,
    });

    // Get total count
    const total = await NewsModel.count({ status, featured, category, needs_review });

    return NextResponse.json({
      success: true,
      data: articles,
      total,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new news article with AI extraction
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { url, featured = false, manualDate, status = 'published' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existing = await NewsModel.findByUrl(url);
    if (existing) {
      return NextResponse.json(
        { error: 'This URL has already been added. Please check existing news articles.' },
        { status: 409 }
      );
    }

    console.log(`📰 Processing news article: ${url}`);

    // Extract metadata using AI
    const metadata = await generateNewsMetadata(url);

    // Extract date with confidence scoring
    const dateExtractor = new EnhancedDateExtractor();
    const dateResult = await dateExtractor.extractDateWithConfidence(url);

    // Determine category using keyword matching
    const category = await determineCategory(metadata.title, metadata.source, metadata.summary);

    // Determine review priority based on confidence and source
    const reviewPriority = determineReviewPriority(url, dateResult);

    // Create article in database
    const article = await NewsModel.create({
      title: metadata.title,
      url,
      source: metadata.source,
      summary: metadata.summary,
      published_date: manualDate || dateResult.publishedDate,
      date_confidence: dateResult.confidence,
      date_extraction_method: dateResult.method,
      date_extraction_notes: dateResult.extractionNotes,
      category,
      tags: metadata.tags || [],
      featured,
      status,
      needs_review: dateResult.needsReview,
      review_priority: reviewPriority,
      created_by: 'admin',
      processed_by: 'AI-ContentExtractor',
    });

    console.log(`✅ News article created: ${article.id}`);

    return NextResponse.json({
      success: true,
      message: 'News article created successfully!',
      data: article,
      metadata: {
        dateConfidence: dateResult.confidence,
        dateMethod: dateResult.method,
        needsReview: dateResult.needsReview,
        reviewPriority,
      },
    });

  } catch (error: any) {
    console.error('Error creating news article:', error);

    if (error.message?.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'AI extraction service not configured. Please set OPENAI_API_KEY.' },
        { status: 500 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create news article';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Helper: Determine content category using keyword analysis
 */
async function determineCategory(title: string, source: string, description?: string): Promise<string> {
  const text = `${title} ${source} ${description || ''}`.toLowerCase();

  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || text.includes('future of work')) {
    return 'AI & Future of Work';
  }
  if (text.includes('web3') || text.includes('blockchain') || text.includes('crypto') || text.includes('defi')) {
    return 'Web3 & Blockchain';
  }
  if (text.includes('robot') || text.includes('automation') || text.includes('manufacturing')) {
    return 'Robotics & Manufacturing';
  }
  if (text.includes('quantum') || text.includes('quantum computing')) {
    return 'Quantum Computing';
  }
  if (text.includes('metaverse') || text.includes('vr') || text.includes('virtual reality') || text.includes('ar')) {
    return 'VR & Metaverse';
  }
  if (text.includes('emerging') || text.includes('innovation') || text.includes('breakthrough')) {
    return 'Emerging Tech';
  }
  if (text.includes('digital') || text.includes('strategy') || text.includes('transformation')) {
    return 'Digital Strategy';
  }

  return 'Tech Innovation';
}

/**
 * Helper: Determine review priority based on source reliability and date confidence
 */
function determineReviewPriority(
  sourceUrl: string,
  dateResult: { confidence: number; needsReview: boolean }
): 'Critical' | 'High' | 'Standard' | 'Low' {
  const domain = new URL(sourceUrl).hostname.replace('www.', '');

  // Critical priority sources (major tech publications)
  const criticalSources = [
    'techcrunch.com',
    'arstechnica.com',
    'wired.com',
    'theverge.com',
    'engadget.com',
  ];

  // High priority sources
  const highPrioritySources = [
    'venturebeat.com',
    'mashable.com',
    'techradar.com',
    'zdnet.com',
    'aibusiness.com',
  ];

  // Determine base priority from source
  let basePriority: 'Critical' | 'High' | 'Standard' | 'Low' = 'Low';

  if (criticalSources.includes(domain)) {
    basePriority = 'Critical';
  } else if (highPrioritySources.includes(domain)) {
    basePriority = 'High';
  } else {
    basePriority = 'Standard';
  }

  // Adjust priority based on confidence level
  if (dateResult.confidence === 0) {
    return 'Critical';
  } else if (dateResult.confidence < 30) {
    return basePriority === 'Standard' ? 'High' : 'Critical';
  } else if (dateResult.confidence >= 85) {
    return basePriority === 'Critical' ? 'High' : 'Low';
  }

  return basePriority;
}
