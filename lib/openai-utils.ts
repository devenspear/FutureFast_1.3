import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variables if available
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    console.warn('OPENAI_API_KEY is not set. OpenAI features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

interface NewsMetadata {
  title: string;
  source: string;
  publishedDate: string; // ISO format date
  summary: string;
  tags: string[];
}

interface ResourceMetadata {
  title: string;
  description: string;
  tags: string[];
  month: string;
  year: string;
}

/**
 * Generate metadata for a news article URL
 */
export async function generateNewsMetadata(url: string): Promise<NewsMetadata> {
  try {
    // If OpenAI client is not available, return fallback metadata
    if (!openai) {
      console.warn('OpenAI client not available. Using fallback metadata for:', url);
      return {
        title: 'Article from ' + new URL(url).hostname,
        source: new URL(url).hostname,
        publishedDate: new Date().toISOString(),
        summary: `This is a placeholder summary for the article at ${url}. OpenAI integration is currently disabled.`,
        tags: ['ai', 'technology', 'news']
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts and generates metadata from news articles. Given a URL, provide a concise title, source name, publication date, summary, and relevant tags."
        },
        {
          role: "user",
          content: `Generate metadata for this news article: ${url}\n\nPlease format your response as JSON with the following fields: title, source, publishedDate (in ISO format), summary (1-2 sentences), and tags (array of 3-5 relevant keywords).`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure we have all required fields with fallbacks
    return {
      title: result.title || 'Untitled Article',
      source: result.source || 'Unknown Source',
      publishedDate: result.publishedDate || new Date().toISOString(),
      summary: result.summary || 'No summary available',
      tags: Array.isArray(result.tags) ? result.tags : ['news'],
    };
  } catch (error) {
    console.error('Error generating news metadata:', error);
    // Return fallback metadata
    return {
      title: 'Article from ' + url,
      source: new URL(url).hostname.replace('www.', ''),
      publishedDate: new Date().toISOString(),
      summary: 'Summary unavailable. Please check the article at the provided URL.',
      tags: ['news'],
    };
  }
}

/**
 * Generate metadata for a PDF resource URL
 */
export async function generateResourceMetadata(url: string, type: string): Promise<ResourceMetadata> {
  try {
    // Get current month and year for fallbacks
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear().toString();

    // If OpenAI client is not available, return fallback metadata
    if (!openai) {
      console.warn('OpenAI client not available. Using fallback metadata for resource:', url);
      return {
        title: `${type} Resource from ${new URL(url).hostname}`,
        description: `This is a placeholder description for the ${type.toLowerCase()} resource at ${url}. OpenAI integration is currently disabled.`,
        tags: [type.toLowerCase(), 'resource', 'document'],
        month: currentMonth,
        year: currentYear
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts and generates metadata from PDF resources. Given a URL and resource type, provide a concise title, description, relevant tags, and publication month/year."
        },
        {
          role: "user",
          content: `Generate metadata for this ${type} resource: ${url}\n\nPlease format your response as JSON with the following fields: title, description (1-2 sentences), tags (array of 3-5 relevant keywords), month (publication month), and year (publication year).`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure we have all required fields with fallbacks
    return {
      title: result.title || `${type} Resource`,
      description: result.description || 'No description available',
      tags: Array.isArray(result.tags) ? result.tags : [type.toLowerCase()],
      month: result.month || currentMonth,
      year: result.year || currentYear,
    };
  } catch (error) {
    console.error('Error generating resource metadata:', error);
    // Return fallback metadata
    const currentDate = new Date();
    
    // Return fallback metadata
    return {
      title: `${type} from ${new URL(url).hostname.replace('www.', '')}`,
      description: 'Description unavailable. Please check the resource at the provided URL.',
      tags: [type.toLowerCase()],
      month: currentDate.toLocaleString('default', { month: 'long' }),
      year: currentDate.getFullYear().toString(),
    };
  }
}
