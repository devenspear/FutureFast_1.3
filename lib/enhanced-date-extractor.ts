import { getOpenAIClient } from './openai-utils';

export interface DateExtractionResult {
  publishedDate: string;
  confidence: number;
  method: 'meta-tags' | 'json-ld' | 'url-pattern' | 'ai-content' | 'ai-fallback' | 'current-date';
  needsReview: boolean;
  extractionNotes?: string;
  rawData?: any;
}

export interface UserAgentConfig {
  userAgent: string;
  acceptLanguage: string;
  accept: string;
}

export class EnhancedDateExtractor {
  private userAgents: UserAgentConfig[] = [
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      acceptLanguage: 'en-US,en;q=0.9',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    },
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      acceptLanguage: 'en-US,en;q=0.9',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
      acceptLanguage: 'en-us',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  ];

  private sourceDomainPatterns: { [key: string]: RegExp[] } = {
    'aibusiness.com': [
      /\/(\d{4})\/(\d{2})\/(\d{2})\//,
      /(\d{4})-(\d{2})-(\d{2})/
    ],
    'techcrunch.com': [
      /\/(\d{4})\/(\d{2})\/(\d{2})\//
    ],
    'venturebeat.com': [
      /\/(\d{4})\/(\d{2})\/(\d{2})\//
    ]
  };

  /**
   * Extract date with enhanced confidence scoring and multiple fallback strategies
   */
  async extractDateWithConfidence(url: string): Promise<DateExtractionResult> {
    console.log(`🔍 Enhanced date extraction for: ${url}`);

    try {
      // Strategy 1: Meta tags and JSON-LD (highest confidence)
      const metaResult = await this.extractFromMetaTags(url);
      if (metaResult.confidence >= 85) {
        return metaResult;
      }

      // Strategy 2: URL pattern analysis (high confidence for known sites)
      const urlResult = await this.extractFromUrlPattern(url);
      if (urlResult.confidence >= 75) {
        return urlResult;
      }

      // Strategy 3: AI-powered content analysis (medium confidence)
      const aiResult = await this.extractFromAIAnalysis(url);
      if (aiResult.confidence >= 60) {
        return aiResult;
      }

      // Strategy 4: Return best available result with review flag
      const bestResult = [metaResult, urlResult, aiResult]
        .filter(r => r.confidence > 0)
        .sort((a, b) => b.confidence - a.confidence)[0];

      if (bestResult && bestResult.confidence > 30) {
        return {
          ...bestResult,
          needsReview: true,
          extractionNotes: 'Low confidence extraction - needs human review'
        };
      }

      // Strategy 5: Fallback to current date with mandatory review
      return {
        publishedDate: new Date().toISOString(),
        confidence: 0,
        method: 'current-date',
        needsReview: true,
        extractionNotes: 'Could not extract date - using current date as fallback'
      };

    } catch (error) {
      console.error('Enhanced date extraction failed:', error);
      return {
        publishedDate: new Date().toISOString(),
        confidence: 0,
        method: 'current-date',
        needsReview: true,
        extractionNotes: `Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract date from meta tags and structured data with enhanced bot detection bypass
   */
  private async extractFromMetaTags(url: string): Promise<DateExtractionResult> {
    for (let attempt = 0; attempt < this.userAgents.length; attempt++) {
      try {
        const userAgentConfig = this.userAgents[attempt];
        console.log(`🌐 Attempting meta tag extraction (attempt ${attempt + 1}): ${url}`);

        const response = await fetch(url, {
          headers: {
            'User-Agent': userAgentConfig.userAgent,
            'Accept': userAgentConfig.accept,
            'Accept-Language': userAgentConfig.acceptLanguage,
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
          },
          signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (!response.ok) {
          console.warn(`HTTP ${response.status} for ${url} (attempt ${attempt + 1})`);

          if (response.status === 403 && attempt < this.userAgents.length - 1) {
            // Try next user agent for 403 errors
            await new Promise(resolve => setTimeout(resolve, 1000 + (attempt * 500))); // Progressive delay
            continue;
          }

          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        return await this.parseMetaAndStructuredData(html, url);

      } catch (error) {
        console.warn(`Meta tag extraction attempt ${attempt + 1} failed:`, error);

        if (attempt === this.userAgents.length - 1) {
          // All attempts failed
          return {
            publishedDate: '',
            confidence: 0,
            method: 'meta-tags',
            needsReview: true,
            extractionNotes: `Meta tag extraction failed after ${this.userAgents.length} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000 + (attempt * 1000)));
      }
    }

    // Fallback (should not reach here)
    return {
      publishedDate: '',
      confidence: 0,
      method: 'meta-tags',
      needsReview: true,
      extractionNotes: 'All meta tag extraction attempts failed'
    };
  }

  /**
   * Parse HTML for meta tags and JSON-LD structured data
   */
  private async parseMetaAndStructuredData(html: string, url: string): Promise<DateExtractionResult> {
    let publishedDate: string | undefined;
    let confidence = 0;
    let method: 'meta-tags' | 'json-ld' = 'meta-tags';
    const rawData: any = {};

    // Enhanced meta tag patterns with confidence scoring
    const datePatterns = [
      { pattern: /<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i, confidence: 95 },
      { pattern: /<meta[^>]*name="article:published_time"[^>]*content="([^"]+)"/i, confidence: 95 },
      { pattern: /<meta[^>]*property="datePublished"[^>]*content="([^"]+)"/i, confidence: 90 },
      { pattern: /<meta[^>]*name="datePublished"[^>]*content="([^"]+)"/i, confidence: 90 },
      { pattern: /<meta[^>]*property="publishedDate"[^>]*content="([^"]+)"/i, confidence: 85 },
      { pattern: /<meta[^>]*name="publishedDate"[^>]*content="([^"]+)"/i, confidence: 85 },
      { pattern: /<meta[^>]*property="dc\.date"[^>]*content="([^"]+)"/i, confidence: 80 },
      { pattern: /<meta[^>]*name="dc\.date"[^>]*content="([^"]+)"/i, confidence: 80 },
      { pattern: /<time[^>]*datetime="([^"]+)"[^>]*pubdate/i, confidence: 85 },
      { pattern: /<time[^>]*pubdate[^>]*datetime="([^"]+)"/i, confidence: 85 },
      { pattern: /<time[^>]*datetime="([^"]+)"/i, confidence: 70 },
    ];

    // Try meta tags first
    for (const { pattern, confidence: patternConfidence } of datePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        publishedDate = match[1];
        confidence = patternConfidence;
        rawData.metaTag = match[0];
        console.log(`📅 Found publication date in meta tags: ${publishedDate} (confidence: ${confidence}%)`);
        break;
      }
    }

    // Try JSON-LD structured data if no high-confidence meta tag found
    if (!publishedDate || confidence < 85) {
      const jsonLdResult = this.extractFromJsonLd(html);
      if (jsonLdResult.publishedDate && jsonLdResult.confidence > confidence) {
        publishedDate = jsonLdResult.publishedDate;
        confidence = jsonLdResult.confidence;
        method = 'json-ld';
        rawData.jsonLd = jsonLdResult.rawData;
        console.log(`📅 Found publication date in JSON-LD: ${publishedDate} (confidence: ${confidence}%)`);
      }
    }

    if (!publishedDate) {
      return {
        publishedDate: '',
        confidence: 0,
        method: 'meta-tags',
        needsReview: true,
        extractionNotes: 'No publication date found in meta tags or structured data'
      };
    }

    // Validate and normalize the date
    const validatedDate = this.validateAndNormalizeDate(publishedDate);
    if (!validatedDate.isValid) {
      return {
        publishedDate: '',
        confidence: 0,
        method,
        needsReview: true,
        extractionNotes: `Invalid date format: ${publishedDate}`,
        rawData
      };
    }

    return {
      publishedDate: validatedDate.isoDate,
      confidence,
      method,
      needsReview: confidence < 80,
      extractionNotes: confidence < 80 ? 'Medium confidence - consider review' : undefined,
      rawData
    };
  }

  /**
   * Extract date from JSON-LD structured data
   */
  private extractFromJsonLd(html: string): { publishedDate?: string; confidence: number; rawData?: any } {
    const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gi);

    if (!jsonLdMatches) {
      return { confidence: 0 };
    }

    for (const match of jsonLdMatches) {
      try {
        const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const structured = JSON.parse(jsonContent);

        const dateResult = this.findDateInStructuredData(structured);
        if (dateResult.publishedDate) {
          return {
            publishedDate: dateResult.publishedDate,
            confidence: 88, // High confidence for structured data
            rawData: structured
          };
        }
      } catch (e) {
        console.warn('Failed to parse JSON-LD:', e);
      }
    }

    return { confidence: 0 };
  }

  /**
   * Recursively search for dates in structured data
   */
  private findDateInStructuredData(obj: any): { publishedDate?: string } {
    if (typeof obj !== 'object' || obj === null) {
      return {};
    }

    // Direct date properties (ordered by preference)
    const dateProps = ['datePublished', 'publishedDate', 'dateCreated', 'dateModified', 'uploadDate'];

    for (const prop of dateProps) {
      if (obj[prop]) {
        return { publishedDate: obj[prop] };
      }
    }

    // Recursively search nested objects and arrays
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          const result = this.findDateInStructuredData(item);
          if (result.publishedDate) return result;
        }
      } else if (typeof value === 'object') {
        const result = this.findDateInStructuredData(value);
        if (result.publishedDate) return result;
      }
    }

    return {};
  }

  /**
   * Extract date from URL patterns (domain-specific)
   */
  private async extractFromUrlPattern(url: string): Promise<DateExtractionResult> {
    const domain = new URL(url).hostname.replace('www.', '');
    const patterns = this.sourceDomainPatterns[domain] || [];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        try {
          const year = parseInt(match[1]);
          const month = parseInt(match[2]);
          const day = parseInt(match[3]);

          // Validate date components
          if (year >= 2020 && year <= new Date().getFullYear() + 1 &&
              month >= 1 && month <= 12 &&
              day >= 1 && day <= 31) {

            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const date = new Date(dateStr);

            if (!isNaN(date.getTime())) {
              console.log(`📅 Extracted date from URL pattern: ${dateStr}`);
              return {
                publishedDate: date.toISOString(),
                confidence: 78, // Good confidence for URL patterns
                method: 'url-pattern',
                needsReview: false,
                extractionNotes: `Extracted from URL pattern: ${pattern.toString()}`,
                rawData: { pattern: pattern.toString(), matches: match }
              };
            }
          }
        } catch (error) {
          console.warn('URL pattern date parsing failed:', error);
        }
      }
    }

    return {
      publishedDate: '',
      confidence: 0,
      method: 'url-pattern',
      needsReview: true,
      extractionNotes: 'No valid date pattern found in URL'
    };
  }

  /**
   * Use AI to analyze content for publication date
   */
  private async extractFromAIAnalysis(url: string): Promise<DateExtractionResult> {
    try {
      console.log(`🤖 AI analysis for date extraction: ${url}`);

      const openaiClient = getOpenAIClient();

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting publication dates from web content. Your task is to find the ACTUAL publication date, not today's date or any other dates.

CRITICAL INSTRUCTIONS:
1. Analyze the URL for date patterns (YYYY/MM/DD or YYYY-MM-DD)
2. Look for publication-related text patterns like "Published on", "Posted", "Date:", etc.
3. Return only the publication date in ISO format (YYYY-MM-DDTHH:MM:SSZ)
4. If you cannot find a publication date with confidence, return "NO_DATE_FOUND"
5. Do NOT use current date as fallback

Respond with JSON: { "publishedDate": "YYYY-MM-DDTHH:MM:SSZ" or "NO_DATE_FOUND", "confidence": 0-100, "reasoning": "explanation" }`
          },
          {
            role: "user",
            content: `Analyze this URL for publication date: ${url}

Please extract the publication date if possible from the URL structure or any other indicators.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      if (result.publishedDate === "NO_DATE_FOUND") {
        return {
          publishedDate: '',
          confidence: 0,
          method: 'ai-content',
          needsReview: true,
          extractionNotes: `AI could not extract date: ${result.reasoning || 'No reason provided'}`,
          rawData: result
        };
      }

      const validatedDate = this.validateAndNormalizeDate(result.publishedDate);
      if (!validatedDate.isValid) {
        return {
          publishedDate: '',
          confidence: 0,
          method: 'ai-content',
          needsReview: true,
          extractionNotes: `AI returned invalid date: ${result.publishedDate}`,
          rawData: result
        };
      }

      const confidence = Math.min(result.confidence || 50, 70); // Cap AI confidence at 70%

      return {
        publishedDate: validatedDate.isoDate,
        confidence,
        method: 'ai-content',
        needsReview: confidence < 60,
        extractionNotes: result.reasoning || 'AI-based extraction',
        rawData: result
      };

    } catch (error) {
      console.error('AI date extraction failed:', error);
      return {
        publishedDate: '',
        confidence: 0,
        method: 'ai-content',
        needsReview: true,
        extractionNotes: `AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Validate and normalize date string
   */
  private validateAndNormalizeDate(dateStr: string): { isValid: boolean; isoDate: string } {
    if (!dateStr) {
      return { isValid: false, isoDate: '' };
    }

    try {
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        return { isValid: false, isoDate: '' };
      }

      // Check if date is reasonable (not too far in past or future)
      const now = new Date();
      const tenYearsAgo = new Date(now.getFullYear() - 10, 0, 1);
      const oneYearFromNow = new Date(now.getFullYear() + 1, 11, 31);

      if (date < tenYearsAgo || date > oneYearFromNow) {
        console.warn(`Date out of reasonable range: ${dateStr}`);
        return { isValid: false, isoDate: '' };
      }

      return { isValid: true, isoDate: date.toISOString() };
    } catch (error) {
      return { isValid: false, isoDate: '' };
    }
  }

  /**
   * Get confidence level description
   */
  getConfidenceDescription(confidence: number): string {
    if (confidence >= 85) return 'High';
    if (confidence >= 60) return 'Medium';
    if (confidence >= 30) return 'Low';
    return 'None';
  }
}