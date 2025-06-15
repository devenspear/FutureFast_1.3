import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.futurefast.ai';
  const staticPages = ['/', '/about', '/resources', '/podcasts', '/privacy', '/terms']; // extend as needed

  const routes = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString()
  }));

  // optionally fetch dynamic pages here
  return routes;
} 