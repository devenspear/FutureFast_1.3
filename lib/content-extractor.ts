import { generateNewsMetadata } from './openai-utils';

interface LocalExtractedContent {
  title: string;
  source: string;
  publishedDate: string;
  success: boolean;
  error?: string;
}



class ContentExtractor {
  constructor() {
    // Using existing OpenAI setup from openai-utils
  }

  async extractFromUrl(url: string): Promise<LocalExtractedContent & { url: string }> {
    try {
      console.log(`🔍 Extracting content from: ${url}`);
      
      // Use existing OpenAI metadata generation
      const metadata = await generateNewsMetadata(url);
      
      // Transform to our expected format
      const extractedData = {
        title: metadata.title,
        source: metadata.source,
        publishedDate: metadata.publishedDate.split('T')[0] // Convert ISO to YYYY-MM-DD
      };
      
      console.log(`✅ Successfully extracted content:`, extractedData);
      return {
        ...extractedData,
        url,
        success: true
      };
      
    } catch (error) {
      console.error(`❌ Failed to extract content from ${url}:`, error);
      
      // Fallback to basic extraction
      try {
        const fallbackData = await this.fallbackExtraction(url);
        return {
          ...fallbackData,
          url,
          success: true
        };
      } catch {
        return {
          title: '',
          source: '',
          publishedDate: '',
          url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }

  private async fallbackExtraction(url: string): Promise<Omit<LocalExtractedContent, 'success' | 'error'>> {
    // Simple fallback using URL parsing
    const domain = new URL(url).hostname.replace('www.', '');
    
    return {
      title: `Article from ${domain}`,
      source: this.cleanSource(domain),
      publishedDate: new Date().toISOString().split('T')[0] // Today's date
    };
  }

  private cleanSource(source: string): string {
    return source
      .replace(/\.com$|\.org$|\.net$/i, '')
      .replace(/^www\./i, '')
      .replace(/@/g, '')
      .trim();
  }

  extractUrlsFromText(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const matches = text.match(urlRegex) || [];
    return matches.map(url => url.replace(/[.,;!?]$/, '')); // Remove trailing punctuation
  }
}

export { ContentExtractor };
export default ContentExtractor; 