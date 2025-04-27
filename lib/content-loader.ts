import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define types for the content
export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  featured: boolean;
}

export interface CatalogItem {
  title: string;
  description: string;
  year: number | string;
  month: string;
  type: string;
  tag: string;
  image: string;
  url: string;
  body: string;
  [key: string]: unknown; // For any additional fields
}

// Base function to load content from a markdown file
export function loadMarkdownContent(filePath: string): { data: Record<string, unknown>; content: string } {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      return { data, content };
    }
    console.warn(`File not found: ${filePath}`);
    return { data: {}, content: '' };
  } catch (error) {
    console.error(`Error loading content from ${filePath}:`, error);
    return { data: {}, content: '' };
  }
}

// Load site settings
export function loadSiteSettings() {
  const filePath = path.join(process.cwd(), 'content/site/settings.md');
  const { data } = loadMarkdownContent(filePath);
  return {
    siteTitle: data.site_title || 'FutureFast',
    footerText: data.footer_text || '2025 Deven Spear | All Rights Reserved',
  };
}

// Load hero section content
export function loadHeroContent() {
  const filePath = path.join(process.cwd(), 'content/sections/hero.md');
  const { data } = loadMarkdownContent(filePath);
  return {
    headline: data.headline || 'Win the Race of Exponential Disruption',
    subheadline: data.subheadline || 'Executive-level insights on AI, Web3, Robotics & beyond',
  };
}

// Load about section content
export function loadAboutContent() {
  const filePath = path.join(process.cwd(), 'content/sections/about.md');
  const { data } = loadMarkdownContent(filePath);
  return {
    headline: data.headline || 'About FutureFast',
    subheadline: data.subheadline || 'Our mission is to empower leaders with clarity in a world of exponential change.',
  };
}

// Load about me content
export function loadAboutMeContent() {
  const filePath = path.join(process.cwd(), 'content/sections/about_me.md');
  const { data } = loadMarkdownContent(filePath);
  return {
    title: data.title || 'About Deven',
    headline: data.headline || 'About Deven',
    image: data.image || '/DKS_Future_head.JPG',
    bio_paragraphs: data.bio_paragraphs || [
      "Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity."
    ],
  };
}

// Load why we exist content
export function loadWhyWeExistContent() {
  const filePath = path.join(process.cwd(), 'content/sections/why_we_exist.md');
  const { data } = loadMarkdownContent(filePath);
  return {
    headline: data.headline || 'Why We Exist',
    subheadline: data.subheadline || '',
    problem_statement: data.problem_statement || '',
    solution_statement: data.solution_statement || '',
    how_different: data.how_different || [],
  };
}

// Load quotes for scrolling quotes section
export function loadScrollingQuotes() {
  const filePath = path.join(process.cwd(), 'content/quotes/scrolling_quotes.md');
  const { data } = loadMarkdownContent(filePath);
  return data.quotes || [
    { text: "The best way to predict the future is to create it.", author: "Alan Kay" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The future is already here – it's just not evenly distributed.", author: "William Gibson" },
  ];
}

// Load thought leaders
export function loadThoughtLeaders() {
  const filePath = path.join(process.cwd(), 'content/thought-leaders/thought-leaders.md');
  const { data } = loadMarkdownContent(filePath);
  return data.leaders || [];
}

// Load all news items
export function loadNewsItems(): NewsItem[] {
  const newsDir = path.join(process.cwd(), 'content/news');
  let newsItems: NewsItem[] = [];
  
  if (fs.existsSync(newsDir)) {
    newsItems = fs.readdirSync(newsDir)
      .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
      .map((file) => {
        const filePath = path.join(newsDir, file);
        const { data } = loadMarkdownContent(filePath);
        return {
          title: data.title as string || '',
          source: data.source as string || '',
          url: data.url as string || '#',
          publishedDate: data.publishedDate as string || new Date().toISOString(),
          featured: data.featured as boolean || false,
        };
      })
      // Sort by date (newest first)
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }
  
  return newsItems;
}

// Load all catalog items
export function loadCatalogItems(): CatalogItem[] {
  const catalogDir = path.join(process.cwd(), 'content/catalog');
  let catalogItems: CatalogItem[] = [];
  
  if (fs.existsSync(catalogDir)) {
    catalogItems = fs.readdirSync(catalogDir)
      .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
      .map((file) => {
        const filePath = path.join(catalogDir, file);
        const { data, content } = loadMarkdownContent(filePath);
        return {
          title: data.title as string || '',
          description: data.description as string || '',
          year: data.year as string || new Date().getFullYear(),
          month: data.month as string || '',
          type: data.type as string || '',
          tag: data.tag as string || '',
          image: data.image as string || '',
          url: data.url as string || '#',
          body: content,
          ...data as Record<string, unknown>
        };
      });
  }
  
  return catalogItems;
}
