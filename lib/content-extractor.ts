import { ExtractedContent } from './workflow-types';

export class ContentExtractor {
  async extractFromUrl(url: string): Promise<ExtractedContent> {
    try {
      // Handle YouTube URLs specially
      if (this.isYouTubeUrl(url)) {
        return await this.extractYouTubeContent(url);
      }

      // For other URLs, try basic web scraping
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FutureFast-Bot/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return await this.parseHtmlContent(html, url);
    } catch (error) {
      console.error(`Failed to extract content from ${url}:`, error);
      return {
        url,
        title: this.extractDomainFromUrl(url),
        description: 'Content extraction failed',
        metadata: {
          domain: this.extractDomainFromUrl(url),
          type: 'article',
        },
      };
    }
  }

  private isYouTubeUrl(url: string): boolean {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url);
  }

  private async extractYouTubeContent(url: string): Promise<ExtractedContent> {
    // Extract video ID from URL
    const videoId = this.extractYouTubeVideoId(url);
    
    // Try YouTube API if available, otherwise use fallback
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (apiKey && videoId) {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const snippet = data.items[0].snippet;
          return {
            url,
            title: snippet.title,
            description: snippet.description.slice(0, 300) + '...',
            metadata: {
              author: snippet.channelTitle,
              publishDate: snippet.publishedAt,
              domain: 'youtube.com',
              type: 'video',
            },
          };
        }
      } catch (error) {
        console.error('YouTube API extraction failed:', error);
      }
    }
    
    // Fallback for YouTube
    return {
      url,
      title: 'YouTube Video',
      description: 'Video content from YouTube',
      metadata: {
        domain: 'youtube.com',
        type: 'video',
      },
    };
  }

  private extractYouTubeVideoId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

  private async parseHtmlContent(html: string, url: string): Promise<ExtractedContent> {
    // Basic HTML parsing (in production, you might want to use cheerio or similar)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    
    const title = titleMatch ? titleMatch[1].trim() : this.extractDomainFromUrl(url);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    
    // Extract domain for metadata
    const domain = this.extractDomainFromUrl(url);
    
    return {
      url,
      title,
      description,
      metadata: {
        domain,
        type: 'article',
      },
    };
  }

  private extractDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'unknown';
    }
  }

  extractUrlsFromText(text: string): string[] {
    const urlRegex = /https?:\/\/(?:[-\w.])+(?:[:\d]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?/g;
    return text.match(urlRegex) || [];
  }
} 