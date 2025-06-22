import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variables if available
let openai: OpenAI | null = null;

/**
 * Get OpenAI client instance, creating it if necessary
 */
export function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    try {
      console.log('Initializing OpenAI client with API key:', apiKey.substring(0, 10) + '...');
      openai = new OpenAI({ apiKey });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw new Error('Failed to initialize OpenAI client: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
  
  return openai;
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
    // Get OpenAI client
    const openaiClient = getOpenAIClient();
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts and generates metadata from news articles. Given a URL, provide a concise title, source name, publication date, summary, and relevant tags."
        },
        {
          role: "user",
          content: `Generate metadata for this news article: ${url}\n\nPlease format your response as JSON with the following fields: title, source, publishedDate (extract the actual publication date from the article and format as ISO), summary (1-2 sentences), and tags (array of 3-5 relevant keywords). If you cannot determine the publication date, use today's date as fallback.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Use AI-extracted date if available, otherwise use current date
    let publishedDate = result.publishedDate;
    if (!publishedDate) {
      publishedDate = new Date().toISOString();
    } else {
      // Validate and ensure it's in ISO format
      try {
        const date = new Date(publishedDate);
        if (isNaN(date.getTime())) {
          publishedDate = new Date().toISOString();
        } else {
          publishedDate = date.toISOString();
        }
      } catch {
        publishedDate = new Date().toISOString();
      }
    }
    
    return {
      title: result.title || 'Untitled Article',
      source: result.source || 'Unknown Source',
      publishedDate,
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

    // Get OpenAI client
    const openaiClient = getOpenAIClient();

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts and generates metadata from PDF resources. Given a URL and resource type, provide a concise title, description, relevant tags, and publication month/year."
        },
        {
          role: "user",
          content: `Generate metadata for this ${type} resource: ${url}\n\nPlease format your response as JSON with the following fields: title, description (1-2 sentences), tags (array of 3-5 relevant keywords), month (use current month), and year (use current year). Always use the current date to show this as recently added content.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Always use current date regardless of what AI extracts
    // This ensures new content appears at top of resource library
    return {
      title: result.title || `${type} Resource`,
      description: result.description || 'No description available',
      tags: Array.isArray(result.tags) ? result.tags : [type.toLowerCase()],
      month: currentMonth, // Always current month
      year: currentYear,   // Always current year
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
