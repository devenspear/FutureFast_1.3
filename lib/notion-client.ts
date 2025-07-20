import { Client } from '@notionhq/client';

export interface NotionNewsItem {
  id: string;
  title: string;
  source: string;
  publishedDate: string;
  sourceUrl: string;
  status?: string;
}

class NotionClient {
  private client: Client;
  private databaseId: string;

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_API_KEY || process.env.NOTION_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
  }

  async getNewsArticles(): Promise<NotionNewsItem[]> {
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
            }
          ]
        },
        sorts: [
          {
            property: 'Publication Date',
            direction: 'descending'
          }
        ],
        page_size: 5 // Limit to 5 most recent articles
      });

      return response.results.map((page: any) => {
        const properties = page.properties;
        
        return {
          id: page.id,
          title: this.extractTitle(properties.Title),
          source: this.extractRichText(properties.Source),
          publishedDate: this.extractDate(properties['Publication Date']),
          sourceUrl: this.extractUrl(properties['Source URL']),
          status: this.extractSelect(properties.Status),
        };
      });
    } catch (error) {
      console.error('Error fetching from Notion:', error);
      throw new Error('Failed to fetch news articles from Notion');
    }
  }

  private extractTitle(titleProperty: any): string {
    if (!titleProperty?.title) return '';
    return titleProperty.title.map((t: any) => t.plain_text).join('');
  }

  private extractRichText(richTextProperty: any): string {
    if (!richTextProperty?.rich_text) return '';
    return richTextProperty.rich_text.map((t: any) => t.plain_text).join('');
  }

  private extractDate(dateProperty: any): string {
    if (!dateProperty?.date?.start) return '';
    return dateProperty.date.start;
  }

  private extractUrl(urlProperty: any): string {
    return urlProperty?.url || '';
  }

  private extractSelect(selectProperty: any): string {
    return selectProperty?.select?.name || '';
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
   * Get records that contain YouTube URLs (for YouTube processing)
   */
  async getYouTubeRecords(): Promise<NotionNewsItem[]> {
    try {
      console.log('🎥 Querying records with YouTube URLs...');
      
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
              property: 'Status',
              select: {
                equals: 'Published'
              }
            }
          ]
        }
      });

      // Filter for YouTube URLs on the client side since Notion doesn't support URL pattern filtering
      const youtubeRecords = response.results
        .map((page: any) => {
          const properties = page.properties;
          return {
            id: page.id,
            title: this.extractTitle(properties.Title),
            source: this.extractRichText(properties.Source),
            publishedDate: this.extractDate(properties['Publication Date']),
            sourceUrl: this.extractUrl(properties['Source URL']),
            status: this.extractSelect(properties.Status),
          };
        })
        .filter(record => this.isYouTubeUrl(record.sourceUrl));

      console.log(`✅ Found ${youtubeRecords.length} YouTube records`);
      return youtubeRecords;
      
    } catch (error) {
      console.error('❌ Failed to query YouTube records:', error);
      throw error;
    }
  }

  /**
   * Get records that need AI content extraction (excluding YouTube URLs)
   */
  async getIncompleteRecords(): Promise<NotionNewsItem[]> {
    try {
      console.log('🔍 Querying records that need AI content extraction...');
      
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
                }
              ]
            }
          ]
        }
      });

      // Filter out YouTube URLs from news processing
      const nonYouTubeRecords = response.results
        .map((page: any) => {
          const properties = page.properties;
          return {
            id: page.id,
            title: this.extractTitle(properties.Title),
            source: this.extractRichText(properties.Source),
            publishedDate: this.extractDate(properties['Publication Date']),
            sourceUrl: this.extractUrl(properties['Source URL']),
            status: this.extractSelect(properties.Status),
          };
        })
        .filter(record => !this.isYouTubeUrl(record.sourceUrl)); // Exclude YouTube URLs

      console.log(`✅ Found ${nonYouTubeRecords.length} non-YouTube records needing content extraction`);
      
      return nonYouTubeRecords;
    } catch (error) {
      console.error('❌ Failed to query incomplete records:', error);
      throw error;
    }
  }

  async updateRecord(pageId: string, updates: {
    title?: string;
    source?: string;
    publishedDate?: string;
  }): Promise<void> {
    try {
      console.log(`🔄 Updating record ${pageId} with AI-extracted content...`);
      
      const properties: any = {};
      
      if (updates.title) {
        properties.Title = {
          title: [
            {
              text: {
                content: updates.title
              }
            }
          ]
        };
      }
      
      if (updates.source) {
        properties.Source = {
          rich_text: [
            {
              text: {
                content: updates.source
              }
            }
          ]
        };
      }
      
      if (updates.publishedDate) {
        properties['Publication Date'] = {
          date: {
            start: updates.publishedDate
          }
        };
      }

      // Automatically set Status to "Published" when AI populates the record
      properties.Status = {
        select: {
          name: "Published"
        }
      };

      await this.client.pages.update({
        page_id: pageId,
        properties
      });

      console.log(`✅ Successfully updated record ${pageId}`);
      
    } catch (error) {
      console.error(`❌ Failed to update record ${pageId}:`, error);
      throw error;
    }
  }

  async getRecordById(pageId: string): Promise<NotionNewsItem | null> {
    try {
      const page = await this.client.pages.retrieve({ page_id: pageId });
      
      if (!('properties' in page)) {
        return null;
      }

      const properties = page.properties;
      
      return {
        id: page.id,
        title: this.extractTitle(properties.Title),
        source: this.extractRichText(properties.Source),
        publishedDate: this.extractDate(properties['Publication Date']),
        sourceUrl: this.extractUrl(properties['Source URL']),
        status: this.extractSelect(properties.Status),
      };
    } catch (error) {
      console.error(`❌ Failed to get record ${pageId}:`, error);
      return null;
    }
  }
}

export default NotionClient; 