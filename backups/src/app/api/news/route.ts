import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the NewsItem interface
interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  icon: string;
  featured: boolean;
}

// News articles are sourced from individual .md files in the 'content/news' directory.
// Each file should contain frontmatter with fields like: title, source, date (e.g., "April 30, 2025" or ISO format), url, icon, featured (boolean).
export async function GET() {
  try {
    const newsDir = path.join(process.cwd(), 'content/news');
    let newsItems: NewsItem[] = [];
    
    if (fs.existsSync(newsDir)) {
      newsItems = fs.readdirSync(newsDir)
        .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
        .map((file) => {
          const filePath = path.join(newsDir, file);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContents);
          
          // Standardize date field (some files use date, others use publishedDate)
          const dateValue = data.date || data.publishedDate || '';
          
          return {
            title: data.title || '',
            source: data.source || '',
            date: dateValue,
            url: data.url || '#',
            icon: data.icon || '🔍',
            featured: data.featured || false,
          } as NewsItem;
        })
        // Sort by date (newest first) - parse the date strings
        .sort((a, b) => {
          // Parse dates like "April 30, 2025" or ISO format
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
    }
    
    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching news items:', error);
    return NextResponse.json({ error: 'Failed to fetch news items' }, { status: 500 });
  }
}
