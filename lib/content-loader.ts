'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import 'server-only';
import { existsSync } from 'fs';

// Define types for the content
export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  featured: boolean;
}

export interface YouTubeVideoItem {
  url: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  publishedAt?: string; // Optional as it will be populated from YouTube API
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

export interface HeroContent {
  headline: string;
  subheadline: string;
}

export interface FastLaneContent {
  headline: string;
  intro: string;
  why_it_matters_heading: string;
  bullet_points: string[];
  closing_text: string;
  call_to_action: string;
}

export interface AboutContent {
  headline: string;
  subheadline: string;
  features: { title: string; description: string }[];
}

export interface SiteSettings {
  siteTitle: string;
  footerText: string;
}

// Base function to load content from a markdown file
export async function loadMarkdownContent(filePath: string): Promise<{ data: Record<string, unknown>; content: string }> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { data, content };
  } catch (error) {
    console.error(`Error loading content from ${filePath}:`, error);
    return { data: {}, content: '' };
  }
}

// Load site settings
export async function loadSiteSettings(): Promise<SiteSettings> {
  const filePath = path.join(process.cwd(), 'content/site/settings.md');
  const { data } = await loadMarkdownContent(filePath);
  return {
    siteTitle: String(data.site_title || 'FutureFast'),
    footerText: String(data.footer_text || '2025 Deven Spear | All Rights Reserved'),
  };
}

// Load hero section content
export async function loadHeroContent(): Promise<HeroContent> {
  const filePath = path.join(process.cwd(), 'content/sections/hero.md');
  const { data } = await loadMarkdownContent(filePath);
  return {
    headline: String(data.headline || 'Win the Race of Exponential Disruption'),
    subheadline: String(data.subheadline || 'Executive-level insights on AI, Web3, Robotics & beyond'),
  };
}

// Load fast lane section content
export async function loadFastLaneContent(): Promise<FastLaneContent> {
  const filePath = path.join(process.cwd(), 'content/sections/fast_lane.md');
  const { data } = await loadMarkdownContent(filePath);
  return {
    headline: String(data.headline || 'Welcome to the Fast Lane'),
    intro: String(data.intro || ''),
    why_it_matters_heading: String(data.why_it_matters_heading || 'Why It Matters'),
    bullet_points: Array.isArray(data.bullet_points) ? data.bullet_points.map(String) : [],
    closing_text: String(data.closing_text || ''),
    call_to_action: String(data.call_to_action || '')
  };
}

// Load about section content
export async function loadAboutContent(): Promise<AboutContent> {
  const filePath = path.join(process.cwd(), 'content/sections/about.md');
  const { data } = await loadMarkdownContent(filePath);
  return {
    headline: String(data.headline || 'About FutureFast'),
    subheadline: String(data.subheadline || 'Our mission is to empower leaders with clarity in a world of exponential change.'),
    features: Array.isArray(data.features) ? data.features : [
      {
        title: 'Executive-First',
        description: 'Written for decision-makers, not developers. No code, just clarity.'
      },
      {
        title: 'Neutral Librarian',
        description: 'We curate all credible voices—McKinsey, CB Insights, podcasts, whitepapers—so you don\'t have to.'
      },
      {
        title: 'Radically Clear',
        description: 'If a ninth-grader can\'t understand it, we rewrite it. Clarity is our obsession.'
      }
    ]
  };
}

// Load about me content
export async function loadAboutMeContent() {
  const filePath = path.join(process.cwd(), 'content/sections/about_me.md');
  const { data } = await loadMarkdownContent(filePath);
  return {
    title: String(data.title || 'About Deven'),
    headline: String(data.headline || 'About Deven'),
    image: String(data.image || '/DKS_Future_head.JPG'),
    bio_paragraphs: Array.isArray(data.bio_paragraphs) ? data.bio_paragraphs : [
      "Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity."
    ],
  };
}

// Load why we exist content
export async function loadWhyWeExistContent() {
  const filePath = path.join(process.cwd(), 'content/sections/why_we_exist.md');
  const { data } = await loadMarkdownContent(filePath);
  return {
    headline: String(data.headline || 'Why We Exist'),
    subheadline: String(data.subheadline || ''),
    problem_statement: String(data.problem_statement || ''),
    solution_statement: String(data.solution_statement || ''),
    how_different: Array.isArray(data.how_different) ? data.how_different : [],
  };
}

// Load quotes for scrolling quotes section
export async function loadScrollingQuotes() {
  const filePath = path.join(process.cwd(), 'content/quotes/scrolling_quotes.md');
  const { data } = await loadMarkdownContent(filePath);
  
  // Check if we have quotes_with_attribution (preferred format)
  if (Array.isArray(data.quotes_with_attribution)) {
    return data.quotes_with_attribution;
  }
  
  // Fall back to simple quotes if available
  if (Array.isArray(data.quotes)) {
    return data.quotes.map(quote => ({ text: String(quote), author: "" }));
  }
  
  // Default quotes if none found
  return [
    { text: "The best way to predict the future is to create it.", author: "Alan Kay" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The future is already here – it's just not evenly distributed.", author: "William Gibson" },
  ];
}

// Load thought leaders
export async function loadThoughtLeaders() {
  const filePath = path.join(process.cwd(), 'content/thought-leaders/thought-leaders.md');
  const { data } = await loadMarkdownContent(filePath);
  return Array.isArray(data.leaders) ? data.leaders : [];
}

// Load YouTube videos from markdown
export async function loadYouTubeVideos(): Promise<YouTubeVideoItem[]> {
  const filePath = path.join(process.cwd(), 'content/youtube/videos.md');
  const { data } = await loadMarkdownContent(filePath);
  
  if (Array.isArray(data.videos)) {
    return data.videos.map((video: Record<string, unknown>) => ({
      url: String(video.url || ''),
      title: String(video.title || ''),
      description: String(video.description || ''),
      category: String(video.category || ''),
      featured: Boolean(video.featured || false),
      publishedAt: video.publishedAt ? String(video.publishedAt) : undefined,
    }));
  }
  
  return [];
}

// Load all news items
export async function loadNewsItems(): Promise<NewsItem[]> {
  const newsDir = path.join(process.cwd(), 'content/news');
  const newsItems: NewsItem[] = [];
  
  if (existsSync(newsDir)) {
    const files = await fs.readdir(newsDir);
    for (const file of files) {
      if (file.endsWith('.md') && !file.startsWith('_')) {
        const filePath = path.join(newsDir, file);
        const { data } = await loadMarkdownContent(filePath);
        newsItems.push({
          title: String(data.title || ''),
          source: String(data.source || ''),
          url: String(data.url || '#'),
          publishedDate: String(data.publishedDate || new Date().toISOString()),
          featured: Boolean(data.featured || false),
        });
      }
    }
  }
  
  return newsItems.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

// Load all catalog items
export async function loadCatalogItems(): Promise<CatalogItem[]> {
  const catalogDir = path.join(process.cwd(), 'content/catalog');
  const catalogItems: CatalogItem[] = [];
  
  if (existsSync(catalogDir)) {
    const files = await fs.readdir(catalogDir);
    for (const file of files) {
      if (file.endsWith('.md') && !file.startsWith('_')) {
        const filePath = path.join(catalogDir, file);
        const { data, content } = await loadMarkdownContent(filePath);
        catalogItems.push({
          title: String(data.title || ''),
          description: String(data.description || ''),
          year: data.year ? Number(data.year) : new Date().getFullYear(),
          month: String(data.month || ''),
          type: String(data.type || ''),
          tag: String(data.tag || ''),
          image: String(data.image || ''),
          url: String(data.url || '#'),
          body: content,
          ...data as Record<string, unknown>
        });
      }
    }
  }
  
  return catalogItems;
}
