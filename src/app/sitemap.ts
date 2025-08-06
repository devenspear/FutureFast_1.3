import type { MetadataRoute } from 'next';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.futurefast.ai';
  const staticPages = ['/', '/about', '/resources', '/podcasts', '/privacy', '/terms', '/blog', '/faq', '/technology-glossary']; // extend as needed

  const routes = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString()
  }));

  // Add dynamic news pages
  const newsDir = path.join(process.cwd(), 'content/news');
  if (fs.existsSync(newsDir)) {
    const newsFiles = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
    const newsRoutes = newsFiles.map(file => {
      const filePath = path.join(newsDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const slug = file.replace(/\.md$/, '');
      return {
        url: `${baseUrl}/news/${slug}`,
        lastModified: data.date || new Date().toISOString()
      };
    });
    routes.push(...newsRoutes);
  }

  // Add dynamic video pages
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');
  if (fs.existsSync(videosDir)) {
    const videoFiles = fs.readdirSync(videosDir).filter(f => f.endsWith('.md'));
    const videoRoutes = videoFiles.map(file => {
      const slug = file.replace(/\.md$/, '');
      return {
        url: `${baseUrl}/videos/${slug}`,
        lastModified: new Date().toISOString()
      };
    });
    routes.push(...videoRoutes);
  }

  // Add dynamic blog pages
  const blogDir = path.join(process.cwd(), 'content/blog');
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
    const blogRoutes = blogFiles.map(file => {
      const filePath = path.join(blogDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const slug = file.replace(/\.md$/, '');
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: data.date || new Date().toISOString()
      };
    });
    routes.push(...blogRoutes);
  }

  return routes;
} 