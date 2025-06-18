import { NextResponse } from 'next/server';
import NotionClient from '../../../../lib/notion-client';

export async function GET() {
  try {
    // Check if Notion credentials are configured
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json({ 
        error: 'Notion credentials not configured. Please set NOTION_TOKEN and NOTION_DATABASE_ID environment variables.' 
      }, { status: 500 });
    }

    const notionClient = new NotionClient();
    const notionNews = await notionClient.getNewsArticles();

    // Transform Notion data to match existing NewsItem interface
    const newsItems = notionNews.map(item => ({
      title: item.title,
      source: item.source,
      date: item.publishedDate,
      url: item.sourceUrl,
      icon: '📰', // Default icon for Notion news
      featured: false, // You can add a featured field to Notion if needed
    }));

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching Notion news:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch news from Notion',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 