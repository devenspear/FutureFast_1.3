import { Client } from '@notionhq/client';

export interface EnhancedNotionItem {
  id: string;
  title: string;
  source: string;
  publishedDate: string;
  sourceUrl: string;
  status?: string;
  contentType?: 'News Article' | 'YouTube Video';
  category?: string;
  featured?: boolean;
  processed?: boolean;
  description?: string;
  websiteValidated?: boolean;
  websiteStatus?: 'Live' | 'Missing' | 'Checking' | 'Error';
  lastProcessed?: string;
  processingStatus?: string;
  // Enhanced date extraction fields
  dateConfidence?: number;
  dateExtractionMethod?: string;
  needsReview?: boolean;
  dateExtractionNotes?: string;
  manualDateOverride?: string;
  reviewPriority?: 'Critical' | 'High' | 'Standard' | 'Low';
  reviewedBy?: string;
  reviewedAt?: string;
}

export class EnhancedNotionClient {
  private client: Client;
  private databaseId: string;

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_API_KEY || process.env.NOTION_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
  }

  /**
   * Check if a URL is a YouTube URL
   */
  private isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    return youtubePatterns.some(pattern => pattern.test(url));
  }

  /**
   * Auto-detect content type based on URL
   */
  private detectContentType(url: string): 'News Article' | 'YouTube Video' {
    return this.isYouTubeUrl(url) ? 'YouTube Video' : 'News Article';
  }

  /**
   * Get all published content items
   */
  async getAllContent(): Promise<EnhancedNotionItem[]> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Publication Date',
            direction: 'descending'
          }
        ]
      });

      return response.results.map((page: any) => this.mapPageToItem(page));
    } catch (error) {
      console.error('Error fetching all content:', error);
      throw new Error('Failed to fetch content from Notion');
    }
  }

  /**
   * Get content by type
   */
  async getContentByType(contentType: 'News Article' | 'YouTube Video'): Promise<EnhancedNotionItem[]> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: 'Status',
              select: {
                equals: 'Published'
              }
            },
            {
              property: 'Content Type',
              select: {
                equals: contentType
              }
            }
          ]
        },
        sorts: [
          {
            property: 'Publication Date',
            direction: 'descending'
          }
        ]
      });

      return response.results.map((page: any) => this.mapPageToItem(page));
    } catch (error) {
      console.error(`Error fetching ${contentType} content:`, error);
      throw new Error(`Failed to fetch ${contentType} content from Notion`);
    }
  }

  /**
   * Get incomplete records that need processing
   */
  async getIncompleteRecords(): Promise<EnhancedNotionItem[]> {
    try {
      console.log('🔍 Querying records that need processing...');
      
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: 'Source URL',
              url: {
                is_not_empty: true
              }
            },
            {
              or: [
                {
                  property: 'Title',
                  title: {
                    is_empty: true
                  }
                },
                {
                  property: 'Source',
                  rich_text: {
                    is_empty: true
                  }
                },
                {
                  property: 'Publication Date',
                  date: {
                    is_empty: true
                  }
                },
                {
                  property: 'Content Type',
                  select: {
                    is_empty: true
                  }
                },
                {
                  property: 'Processed',
                  checkbox: {
                    equals: false
                  }
                }
              ]
            }
          ]
        }
      });

      const items = response.results.map((page: any) => this.mapPageToItem(page));
      console.log(`✅ Found ${items.length} records needing processing`);
      
      return items;
    } catch (error) {
      console.error('❌ Failed to query incomplete records:', error);
      throw error;
    }
  }

  /**
   * Update a record with extracted metadata
   */
  async updateRecord(
    recordId: string,
    updates: {
      title?: string;
      source?: string;
      publishedDate?: string;
      contentType?: 'News Article' | 'YouTube Video';
      category?: string;
      featured?: boolean;
      processed?: boolean;
      description?: string;
      websiteValidated?: boolean;
      websiteStatus?: 'Live' | 'Missing' | 'Checking' | 'Error';
      // Enhanced date extraction fields
      dateConfidence?: number;
      dateExtractionMethod?: string;
      needsReview?: boolean;
      dateExtractionNotes?: string;
      manualDateOverride?: string;
      reviewPriority?: 'Critical' | 'High' | 'Standard' | 'Low';
      reviewedBy?: string;
      reviewedAt?: string;
    }
  ): Promise<void> {
    try {
      const properties: any = {};

      if (updates.title) {
        properties.Title = {
          title: [{ text: { content: updates.title } }]
        };
      }

      if (updates.source) {
        properties.Source = {
          rich_text: [{ text: { content: updates.source } }]
        };
      }

      if (updates.publishedDate) {
        properties['Publication Date'] = {
          date: { start: updates.publishedDate }
        };
      }

      if (updates.contentType) {
        properties['Content Type'] = {
          select: { name: updates.contentType }
        };
      }

      if (updates.category) {
        properties.Category = {
          select: { name: updates.category }
        };
      }

      if (updates.featured !== undefined) {
        properties.Featured = {
          checkbox: updates.featured
        };
      }

      if (updates.processed !== undefined) {
        properties.Processed = {
          checkbox: updates.processed
        };
      }

      if (updates.description) {
        properties.Description = {
          rich_text: [{ text: { content: updates.description } }]
        };
      }

      if (updates.websiteValidated !== undefined) {
        properties['Website Validated'] = {
          checkbox: updates.websiteValidated
        };
      }

      if (updates.websiteStatus) {
        properties['Website Status'] = {
          select: { name: updates.websiteStatus }
        };
      }

      // Enhanced date extraction fields
      if (updates.dateConfidence !== undefined) {
        properties['Date Confidence'] = {
          number: updates.dateConfidence
        };
      }

      if (updates.dateExtractionMethod) {
        properties['Date Extraction Method'] = {
          select: { name: updates.dateExtractionMethod }
        };
      }

      if (updates.needsReview !== undefined) {
        properties['Needs Review'] = {
          checkbox: updates.needsReview
        };
      }

      if (updates.dateExtractionNotes) {
        properties['Date Extraction Notes'] = {
          rich_text: [{ text: { content: updates.dateExtractionNotes } }]
        };
      }

      if (updates.manualDateOverride) {
        properties['Manual Date Override'] = {
          date: { start: updates.manualDateOverride }
        };
      }

      if (updates.reviewPriority) {
        properties['Review Priority'] = {
          select: { name: updates.reviewPriority }
        };
      }

      if (updates.reviewedBy) {
        properties['Reviewed By'] = {
          rich_text: [{ text: { content: updates.reviewedBy } }]
        };
      }

      if (updates.reviewedAt) {
        properties['Reviewed At'] = {
          date: { start: updates.reviewedAt }
        };
      }

      try {
        await this.client.pages.update({
          page_id: recordId,
          properties
        });
        console.log(`✅ Updated Notion record: ${recordId}`);
      } catch (updateError: any) {
        // If the error is about missing properties, try again without enhanced date fields
        if (updateError?.message?.includes('is not a property that exists')) {
          console.warn(`⚠️ Some properties don't exist in Notion, retrying without enhanced date fields...`);

          // Remove enhanced date fields that might not exist
          const basicProperties = { ...properties };
          delete basicProperties['Date Confidence'];
          delete basicProperties['Date Extraction Method'];
          delete basicProperties['Needs Review'];
          delete basicProperties['Date Extraction Notes'];
          delete basicProperties['Manual Date Override'];
          delete basicProperties['Review Priority'];
          delete basicProperties['Reviewed By'];
          delete basicProperties['Reviewed At'];

          await this.client.pages.update({
            page_id: recordId,
            properties: basicProperties
          });
          console.log(`✅ Updated Notion record (without enhanced fields): ${recordId}`);
        } else {
          throw updateError;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to update record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Update processing status for a record
   */
  async updateProcessingStatus(pageId: string, status: 'processing' | 'completed' | 'error', errorMessage?: string): Promise<void> {
    try {
      const updateData: any = {
        'Processing Status': {
          select: {
            name: status === 'processing' ? 'Processing' : 
                  status === 'completed' ? 'Completed' : 'Error'
          }
        }
      };

      // Add error details if present
      if (errorMessage && status === 'error') {
        updateData['Processing Error'] = {
          rich_text: [
            {
              text: {
                content: `${new Date().toISOString()}: ${errorMessage}`
              }
            }
          ]
        };
      }

      // Clear error on successful completion
      if (status === 'completed') {
        updateData['Processing Error'] = {
          rich_text: []
        };
        updateData['Last Processed'] = {
          date: {
            start: new Date().toISOString()
          }
        };
      }

      await this.client.pages.update({
        page_id: pageId,
        properties: updateData
      });

      console.log(`✅ Updated processing status for ${pageId}: ${status}`);
    } catch (error) {
      console.error(`❌ Failed to update processing status for ${pageId}:`, error);
    }
  }

  /**
   * Auto-populate Content Type based on URL
   */
  async autoPopulateContentType(recordId: string, sourceUrl: string): Promise<void> {
    const contentType = this.detectContentType(sourceUrl);
    await this.updateRecord(recordId, { contentType });
  }

  /**
   * Get records that need human review
   */
  async getRecordsNeedingReview(): Promise<EnhancedNotionItem[]> {
    try {
      console.log('🔍 Querying records needing human review...');

      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Needs Review',
          checkbox: {
            equals: true
          }
        },
        sorts: [
          {
            property: 'Review Priority',
            direction: 'ascending'
          },
          {
            property: 'Publication Date',
            direction: 'descending'
          }
        ]
      });

      const items = response.results.map((page: any) => this.mapPageToItem(page));
      console.log(`✅ Found ${items.length} records needing review`);

      return items;
    } catch (error) {
      console.error('❌ Failed to query records needing review:', error);
      throw error;
    }
  }

  /**
   * Mark a record as reviewed
   */
  async markAsReviewed(recordId: string, reviewedBy: string, finalDate?: string): Promise<void> {
    const updates: any = {
      needsReview: false,
      reviewedBy,
      reviewedAt: new Date().toISOString()
    };

    if (finalDate) {
      updates.manualDateOverride = finalDate;
      updates.publishedDate = finalDate;
    }

    await this.updateRecord(recordId, updates);
    console.log(`✅ Marked record ${recordId} as reviewed by ${reviewedBy}`);
  }

  /**
   * Get processing statistics including review metrics
   */
  async getEnhancedProcessingStats(): Promise<{
    totalRecords: number;
    newsArticles: number;
    youtubeVideos: number;
    incompleteRecords: number;
    processedRecords: number;
    needingReview: number;
    highConfidenceExtractions: number;
    mediumConfidenceExtractions: number;
    lowConfidenceExtractions: number;
    byExtractionMethod: { [key: string]: number };
    reviewQueue: {
      critical: number;
      high: number;
      standard: number;
      low: number;
    };
  }> {
    try {
      const [allContent, incompleteRecords, reviewRecords] = await Promise.all([
        this.getAllContent(),
        this.getIncompleteRecords(),
        this.getRecordsNeedingReview()
      ]);

      const newsArticles = allContent.filter(item => item.contentType === 'News Article').length;
      const youtubeVideos = allContent.filter(item => item.contentType === 'YouTube Video').length;
      const processedRecords = allContent.filter(item => item.processed).length;

      // Confidence statistics
      const highConfidence = allContent.filter(item => (item.dateConfidence || 0) >= 85).length;
      const mediumConfidence = allContent.filter(item => (item.dateConfidence || 0) >= 60 && (item.dateConfidence || 0) < 85).length;
      const lowConfidence = allContent.filter(item => (item.dateConfidence || 0) < 60 && (item.dateConfidence || 0) > 0).length;

      // Extraction method statistics
      const byExtractionMethod: { [key: string]: number } = {};
      allContent.forEach(item => {
        if (item.dateExtractionMethod) {
          byExtractionMethod[item.dateExtractionMethod] = (byExtractionMethod[item.dateExtractionMethod] || 0) + 1;
        }
      });

      // Review queue by priority
      const reviewQueue = {
        critical: reviewRecords.filter(item => item.reviewPriority === 'Critical').length,
        high: reviewRecords.filter(item => item.reviewPriority === 'High').length,
        standard: reviewRecords.filter(item => item.reviewPriority === 'Standard').length,
        low: reviewRecords.filter(item => item.reviewPriority === 'Low').length,
      };

      return {
        totalRecords: allContent.length,
        newsArticles,
        youtubeVideos,
        incompleteRecords: incompleteRecords.length,
        processedRecords,
        needingReview: reviewRecords.length,
        highConfidenceExtractions: highConfidence,
        mediumConfidenceExtractions: mediumConfidence,
        lowConfidenceExtractions: lowConfidence,
        byExtractionMethod,
        reviewQueue
      };
    } catch (error) {
      console.error('❌ Failed to get enhanced processing stats:', error);
      throw error;
    }
  }

  /**
   * Map Notion page to our item interface
   */
  private mapPageToItem(page: any): EnhancedNotionItem {
    const properties = page.properties;

    return {
      id: page.id,
      title: this.extractTitle(properties.Title),
      source: this.extractRichText(properties.Source),
      publishedDate: this.extractDate(properties['Publication Date']),
      sourceUrl: this.extractUrl(properties['Source URL']),
      status: this.extractSelect(properties.Status),
      contentType: this.extractSelect(properties['Content Type']) as 'News Article' | 'YouTube Video',
      category: this.extractSelect(properties.Category),
      featured: this.extractCheckbox(properties.Featured),
      processed: this.extractCheckbox(properties.Processed),
      description: this.extractRichText(properties.Description),
      websiteValidated: this.extractCheckbox(properties['Website Validated']),
      websiteStatus: this.extractSelect(properties['Website Status']) as 'Live' | 'Missing' | 'Checking' | 'Error',
      lastProcessed: this.extractDate(properties['Last Processed']),
      processingStatus: this.extractSelect(properties['Processing Status']),
      // Enhanced date extraction fields
      dateConfidence: this.extractNumber(properties['Date Confidence']),
      dateExtractionMethod: this.extractSelect(properties['Date Extraction Method']),
      needsReview: this.extractCheckbox(properties['Needs Review']),
      dateExtractionNotes: this.extractRichText(properties['Date Extraction Notes']),
      manualDateOverride: this.extractDate(properties['Manual Date Override']),
      reviewPriority: this.extractSelect(properties['Review Priority']) as 'Critical' | 'High' | 'Standard' | 'Low',
      reviewedBy: this.extractRichText(properties['Reviewed By']),
      reviewedAt: this.extractDate(properties['Reviewed At']),
    };
  }

  // Helper methods for extracting different property types
  private extractTitle(property: any): string {
    return property?.title?.[0]?.text?.content || '';
  }

  private extractRichText(property: any): string {
    return property?.rich_text?.[0]?.text?.content || '';
  }

  private extractDate(property: any): string {
    return property?.date?.start || '';
  }

  private extractUrl(property: any): string {
    return property?.url || '';
  }

  private extractSelect(property: any): string {
    return property?.select?.name || '';
  }

  private extractCheckbox(property: any): boolean {
    return property?.checkbox || false;
  }

  private extractNumber(property: any): number | undefined {
    return property?.number || undefined;
  }
}

export default EnhancedNotionClient; 