/**
 * Public News API
 * Returns all published news articles from the database
 *
 * This replaces the old file-based system and reads directly from Postgres
 */

import { NextResponse } from 'next/server';
import { NewsModel } from '@/lib/db/models';

// Define the NewsItem interface (kept for backwards compatibility)
interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  icon: string;
  featured: boolean;
  summary?: string;
  category?: string;
}

export async function GET() {
  try {
    // Fetch all published articles from database
    const articles = await NewsModel.findAll({
      status: 'published',
      limit: 1000, // Get all published articles
    });

    // Transform to match the expected interface
    const newsItems: NewsItem[] = articles.map((article) => ({
      title: article.title,
      source: article.source,
      date: article.published_date.toISOString(),
      url: article.url,
      icon: article.icon || '📰',
      featured: article.featured,
      summary: article.summary || undefined,
      category: article.category || undefined,
    }));

    return NextResponse.json(newsItems);

  } catch (error) {
    console.error('Error fetching news items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news items' },
      { status: 500 }
    );
  }
}

// Optional: Add POST endpoint for future use (e.g., webhooks)
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
