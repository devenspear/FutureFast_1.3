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
}

class EnhancedNotionClient {
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

      await this.client.pages.update({
        page_id: recordId,
        properties
      });

      console.log(`✅ Updated Notion record: ${recordId}`);
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
}

export default EnhancedNotionClient; 