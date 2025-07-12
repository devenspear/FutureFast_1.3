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
 * Fetch webpage content and extract metadata from HTML
 */
async function fetchWebpageContent(url: string): Promise<{ 
  html: string; 
  metaTags: Record<string, string>;
  publishedDate?: string;
}> {
  try {
    console.log(`🌐 Fetching webpage content from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract meta tags and structured data
    const metaTags: Record<string, string> = {};
    let publishedDate: string | undefined;

    // Common meta tag patterns for publication dates
    const datePatterns = [
      /<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="article:published_time"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="datePublished"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="datePublished"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="publishedDate"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="publishedDate"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="dc\.date"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="dc\.date"[^>]*content="([^"]+)"/i,
      /<meta[^>]*property="sailthru\.date"[^>]*content="([^"]+)"/i,
      /<meta[^>]*name="sailthru\.date"[^>]*content="([^"]+)"/i,
      /<time[^>]*datetime="([^"]+)"/i,
      /<time[^>]*pubdate[^>]*datetime="([^"]+)"/i,
    ];

    // Try to extract publication date from meta tags
    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        publishedDate = match[1];
        console.log(`📅 Found publication date in meta tags: ${publishedDate}`);
        break;
      }
    }

    // Extract JSON-LD structured data
    if (!publishedDate) {
      const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const match of jsonLdMatches) {
          try {
            const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
            const structured = JSON.parse(jsonContent);
            
            // Look for datePublished in various formats
            const findDate = (obj: any): string | null => {
              if (typeof obj !== 'object' || obj === null) return null;
              
              if (obj.datePublished) return obj.datePublished;
              if (obj.publishedDate) return obj.publishedDate;
              if (obj.dateCreated) return obj.dateCreated;
              if (obj.uploadDate) return obj.uploadDate;
              
              // Recursively search in nested objects
              for (const value of Object.values(obj)) {
                if (Array.isArray(value)) {
                  for (const item of value) {
                    const date = findDate(item);
                    if (date) return date;
                  }
                } else {
                  const date = findDate(value);
                  if (date) return date;
                }
              }
              
              return null;
            };

            const foundDate = findDate(structured);
            if (foundDate) {
              publishedDate = foundDate;
              console.log(`📅 Found publication date in JSON-LD: ${publishedDate}`);
              break;
            }
          } catch (e) {
            // Continue to next JSON-LD block
          }
        }
      }
    }

    // Extract other useful meta tags
    const metaPatterns = [
      { key: 'title', pattern: /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i },
      { key: 'description', pattern: /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i },
      { key: 'siteName', pattern: /<meta[^>]*property="og:site_name"[^>]*content="([^"]+)"/i },
      { key: 'author', pattern: /<meta[^>]*name="author"[^>]*content="([^"]+)"/i },
    ];

    for (const { key, pattern } of metaPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        metaTags[key] = match[1];
      }
    }

    return { html, metaTags, publishedDate };
  } catch (error) {
    console.error(`❌ Failed to fetch webpage content: ${error}`);
    return { html: '', metaTags: {}, publishedDate: undefined };
  }
}

/**
 * Generate metadata for a news article URL with enhanced date extraction
 */
export async function generateNewsMetadata(url: string): Promise<NewsMetadata> {
  try {
    console.log(`🔍 Generating enhanced metadata for: ${url}`);
    
    // First, try to extract content and meta tags from the webpage
    const { html, metaTags, publishedDate: extractedDate } = await fetchWebpageContent(url);
    
    // Get OpenAI client
    const openaiClient = getOpenAIClient();
    
    // Create enhanced prompt with webpage content
    const contentSample = html.substring(0, 8000); // First 8KB of content
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert at extracting metadata from news articles and web pages. Your primary goal is to find the ACTUAL publication date of the article, not today's date.

CRITICAL INSTRUCTIONS FOR DATE EXTRACTION:
1. Look for publication dates in the webpage content (dates near "Published", "Posted", "Updated", etc.)
2. Check for dates in article headers, bylines, or timestamps
3. Look for dates in formats like: "January 15, 2024", "2024-01-15", "Jan 15, 2024", "15 Jan 2024"
4. Avoid using today's date unless absolutely no publication date can be found
5. Convert all dates to ISO format (YYYY-MM-DDTHH:MM:SSZ)
6. If you find multiple dates, use the earliest publication date, not update dates

FALLBACK ONLY: If no publication date is found anywhere, use today's date as absolute last resort.`
        },
        {
          role: "user",
          content: `Extract metadata from this news article URL: ${url}

${extractedDate ? `META TAG DATE FOUND: ${extractedDate}` : 'No meta tag date found'}

${Object.keys(metaTags).length > 0 ? `META TAGS: ${JSON.stringify(metaTags)}` : ''}

WEBPAGE CONTENT SAMPLE:
${contentSample}

Please format your response as JSON with these fields:
- title: Article headline
- source: Publication name (e.g., "TechCrunch", "Forbes")
- publishedDate: ACTUAL publication date in ISO format (YYYY-MM-DDTHH:MM:SSZ)
- summary: 1-2 sentence summary
- tags: Array of 3-5 relevant keywords

Focus especially on finding the correct publication date. Look carefully through the content for date indicators.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Determine the best publication date
    let finalPublishedDate = extractedDate || result.publishedDate;
    
    if (finalPublishedDate) {
      // Validate and normalize the date
      try {
        const date = new Date(finalPublishedDate);
        if (isNaN(date.getTime())) {
          console.warn(`⚠️ Invalid date format: ${finalPublishedDate}, using current date`);
          finalPublishedDate = new Date().toISOString();
        } else {
          finalPublishedDate = date.toISOString();
          console.log(`✅ Using publication date: ${finalPublishedDate}`);
        }
      } catch {
        console.warn(`⚠️ Failed to parse date: ${finalPublishedDate}, using current date`);
        finalPublishedDate = new Date().toISOString();
      }
    } else {
      console.warn(`⚠️ No publication date found for ${url}, using current date`);
      finalPublishedDate = new Date().toISOString();
    }
    
    return {
      title: result.title || metaTags.title || 'Untitled Article',
      source: result.source || metaTags.siteName || new URL(url).hostname.replace('www.', ''),
      publishedDate: finalPublishedDate,
      summary: result.summary || metaTags.description || 'No summary available',
      tags: Array.isArray(result.tags) ? result.tags : ['news'],
    };
  } catch (error) {
    console.error('Error generating enhanced news metadata:', error);
    // Return fallback metadata
    return {
      title: 'Article from ' + new URL(url).hostname.replace('www.', ''),
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
