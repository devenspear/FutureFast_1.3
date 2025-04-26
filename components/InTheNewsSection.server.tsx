import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dynamic from 'next/dynamic';
import type { NewsItem } from './InTheNewsSection';

// Use dynamic import with no SSR to avoid hydration issues
const InTheNewsSection = dynamic(() => import('./InTheNewsSection'), { ssr: false });

export default function InTheNewsSectionServer() {
  const newsDir = path.join(process.cwd(), 'content/news');
  let newsItems: NewsItem[] = [];
  
  if (fs.existsSync(newsDir)) {
    newsItems = fs.readdirSync(newsDir)
      .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
      .map((file) => {
        const filePath = path.join(newsDir, file);
        const { data } = matter(fs.readFileSync(filePath, 'utf8'));
        return {
          title: data.title || '',
          source: data.source || '',
          url: data.url || '#',
          publishedDate: data.publishedDate || new Date().toISOString(),
          featured: data.featured || false,
        } as NewsItem;
      })
      // Sort by date (newest first)
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }

  return <InTheNewsSection newsItems={newsItems} />;
}
