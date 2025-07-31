import EnhancedNotionClient, { EnhancedNotionItem } from './enhanced-notion-client';

export interface ValidationResult {
  recordId: string;
  title: string;
  status: 'Live' | 'Missing' | 'Error';
  websiteUrl?: string;
  error?: string;
}

export interface ValidationSummary {
  total: number;
  live: number;
  missing: number;
  errors: number;
  results: ValidationResult[];
  timestamp: string;
}

export class WebsiteValidationService {
  private enhancedNotionClient: EnhancedNotionClient;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.enhancedNotionClient = new EnhancedNotionClient();
    // Use provided baseUrl or detect from environment
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefast.ai';
  }

  /**
   * Validate all published articles against the live website
   */
  async validateAllArticles(): Promise<ValidationSummary> {
    console.log('🔍 Starting website validation for all published articles...');
    
    try {
      // Get all published articles from Notion
      const publishedArticles = await this.getPublishedArticles();
      console.log(`📄 Found ${publishedArticles.length} published articles in Notion`);

      // Get what's actually live on the website
      const liveArticles = await this.fetchLiveArticles();
      console.log(`🌐 Found ${liveArticles.length} articles live on website`);

      // Validate each Notion article against live website
      const results: ValidationResult[] = [];
      
      for (const article of publishedArticles) {
        const result = await this.validateSingleArticle(article, liveArticles);
        results.push(result);
        
        // Update Notion with validation result
        await this.updateNotionValidationStatus(article.id, result);
      }

      // Generate summary
      const summary: ValidationSummary = {
        total: results.length,
        live: results.filter(r => r.status === 'Live').length,
        missing: results.filter(r => r.status === 'Missing').length,
        errors: results.filter(r => r.status === 'Error').length,
        results,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Validation complete:', {
        total: summary.total,
        live: summary.live,
        missing: summary.missing,
        errors: summary.errors
      });

      return summary;
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  }

  /**
   * Validate a specific article by its Notion record ID
   */
  async validateSpecificArticle(recordId: string): Promise<ValidationResult> {
    console.log(`🔍 Validating specific article: ${recordId}`);
    
    try {
      // Get the article from Notion
      const articles = await this.enhancedNotionClient.getIncompleteRecords();
      const article = articles.find(a => a.id === recordId);
      
      if (!article) {
        throw new Error(`Article with ID ${recordId} not found`);
      }

      // Get live articles
      const liveArticles = await this.fetchLiveArticles();
      
      // Validate
      const result = await this.validateSingleArticle(article, liveArticles);
      
      // Update Notion
      await this.updateNotionValidationStatus(recordId, result);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to validate article ${recordId}:`, error);
      const errorResult: ValidationResult = {
        recordId,
        title: 'Unknown',
        status: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      await this.updateNotionValidationStatus(recordId, errorResult);
      return errorResult;
    }
  }

  /**
   * Get published articles from Notion
   */
  private async getPublishedArticles(): Promise<EnhancedNotionItem[]> {
    try {
      // Use the existing method to get all content, then filter for published news articles
      const allContent = await this.enhancedNotionClient.getContentByType('News Article');
      
      // Filter for items that should be published (have required fields filled)
      const publishedArticles = allContent.filter(article => 
        article.title && 
        article.sourceUrl && 
        article.source &&
        article.publishedDate
      );
      
      return publishedArticles;
    } catch (error) {
      console.error('❌ Failed to fetch published articles:', error);
      throw error;
    }
  }

  /**
   * Fetch articles that are actually live on the website
   */
  private async fetchLiveArticles(): Promise<any[]> {
    try {
      // Try Notion API first (primary source)
      let response = await fetch(`${this.baseUrl}/api/notion-news`);
      
      if (!response.ok) {
        console.log('Notion API failed, trying fallback news API');
        response = await fetch(`${this.baseUrl}/api/news`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch live articles: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch live articles:', error);
      throw error;
    }
  }

  /**
   * Validate a single article against live website data
   */
  private async validateSingleArticle(
    notionArticle: EnhancedNotionItem, 
    liveArticles: any[]
  ): Promise<ValidationResult> {
    try {
      // Look for the article in live data by title and source URL
      const liveMatch = liveArticles.find(live => {
        // Match by title (case insensitive) and URL
        const titleMatch = live.title?.toLowerCase().trim() === notionArticle.title?.toLowerCase().trim();
        const urlMatch = live.url === notionArticle.sourceUrl;
        
        return titleMatch || urlMatch;
      });

      if (liveMatch) {
        return {
          recordId: notionArticle.id,
          title: notionArticle.title || 'Unknown Title',
          status: 'Live',
          websiteUrl: liveMatch.url
        };
      } else {
        return {
          recordId: notionArticle.id,
          title: notionArticle.title || 'Unknown Title',
          status: 'Missing'
        };
      }
    } catch (error) {
      return {
        recordId: notionArticle.id,
        title: notionArticle.title || 'Unknown Title',
        status: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update Notion record with validation status
   */
  private async updateNotionValidationStatus(
    recordId: string, 
    result: ValidationResult
  ): Promise<void> {
    try {
      await this.enhancedNotionClient.updateRecord(recordId, {
        websiteValidated: result.status === 'Live',
        websiteStatus: result.status
      });
      
      console.log(`✅ Updated validation status for ${recordId}: ${result.status}`);
    } catch (error) {
      console.error(`❌ Failed to update validation status for ${recordId}:`, error);
    }
  }

  /**
   * Get validation statistics without running full validation
   */
  async getValidationStats(): Promise<{
    totalPublished: number;
    totalValidated: number;
    totalLive: number;
    totalMissing: number;
    lastValidated?: string;
  }> {
    try {
      const publishedArticles = await this.getPublishedArticles();
      
      const stats = {
        totalPublished: publishedArticles.length,
        totalValidated: publishedArticles.filter(a => a.websiteValidated !== undefined).length,
        totalLive: publishedArticles.filter(a => a.websiteStatus === 'Live').length,
        totalMissing: publishedArticles.filter(a => a.websiteStatus === 'Missing').length,
        lastValidated: publishedArticles
          .map(a => a.lastProcessed)
          .filter(Boolean)
          .sort()
          .pop()
      };
      
      return stats;
    } catch (error) {
      console.error('❌ Failed to get validation stats:', error);
      throw error;
    }
  }
}

export default WebsiteValidationService;