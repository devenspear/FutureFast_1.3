import EnhancedNotionClient, { EnhancedNotionItem } from './enhanced-notion-client';
import { ContentExtractor } from './content-extractor';
import NotionYouTubeService from './notion-youtube-service';
import { generateNewsMetadata } from './openai-utils';

interface ProcessingResult {
  recordId: string;
  sourceUrl: string;
  contentType: 'News Article' | 'YouTube Video';
  success: boolean;
  extracted?: {
    title: string;
    source: string;
    publishedDate: string;
    category?: string;
    description?: string;
    featured?: boolean;
  };
  error?: string;
}

interface UnifiedProcessingStats {
  total: number;
  successful: number;
  failed: number;
  newsArticles: number;
  youtubeVideos: number;
  results: ProcessingResult[];
}

export class UnifiedContentService {
  private enhancedNotionClient: EnhancedNotionClient;
  private contentExtractor: ContentExtractor;
  private youtubeService: NotionYouTubeService;

  constructor() {
    this.enhancedNotionClient = new EnhancedNotionClient();
    this.contentExtractor = new ContentExtractor();
    this.youtubeService = new NotionYouTubeService();
  }

  /**
   * Extract video ID from YouTube URL
   */
  private extractVideoId(url: string): string | null {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Determine content category using AI and keyword analysis
   */
  private async determineCategory(title: string, source: string, description?: string): Promise<string> {
    const text = `${title} ${source} ${description || ''}`.toLowerCase();
    
    // Keyword-based categorization
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || text.includes('future of work')) {
      return 'AI & Future of Work';
    }
    if (text.includes('web3') || text.includes('blockchain') || text.includes('crypto') || text.includes('defi')) {
      return 'Web3 & Blockchain';
    }
    if (text.includes('robot') || text.includes('automation') || text.includes('manufacturing')) {
      return 'Robotics & Manufacturing';
    }
    if (text.includes('quantum') || text.includes('quantum computing')) {
      return 'Quantum Computing';
    }
    if (text.includes('metaverse') || text.includes('vr') || text.includes('virtual reality') || text.includes('ar')) {
      return 'VR & Metaverse';
    }
    if (text.includes('emerging') || text.includes('innovation') || text.includes('breakthrough')) {
      return 'Emerging Tech';
    }
    if (text.includes('digital') || text.includes('strategy') || text.includes('transformation')) {
      return 'Digital Strategy';
    }
    
    // Default category
    return 'Tech Innovation';
  }

  /**
   * Process a single content record
   */
  async processContentRecord(record: EnhancedNotionItem): Promise<ProcessingResult> {
    try {
      console.log(`🔄 Processing: ${record.sourceUrl}`);

      // Auto-detect content type if not set
      const contentType = record.contentType || (this.extractVideoId(record.sourceUrl) ? 'YouTube Video' : 'News Article');
      
      if (contentType === 'YouTube Video') {
        return await this.processYouTubeContent(record);
      } else {
        return await this.processNewsContent(record);
      }
    } catch (error) {
      console.error(`❌ Error processing record ${record.id}:`, error);
      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: record.contentType || 'News Article',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process YouTube content
   */
  private async processYouTubeContent(record: EnhancedNotionItem): Promise<ProcessingResult> {
    try {
      const videoId = this.extractVideoId(record.sourceUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Use YouTube service to add to video management system
      const youtubeResult = await this.youtubeService.processYouTubeRecord({
        id: record.id,
        title: record.title,
        source: record.source,
        publishedDate: record.publishedDate,
        sourceUrl: record.sourceUrl,
        status: record.status
      });

      if (!youtubeResult.success) {
        throw new Error(youtubeResult.error || 'YouTube processing failed');
      }

      // Extract metadata using OpenAI for YouTube videos too
      let metadata: any = {};
      try {
        metadata = await generateNewsMetadata(record.sourceUrl);
      } catch (error) {
        console.warn('Could not extract metadata with OpenAI for YouTube video:', error);
        // Use basic info if OpenAI fails
        metadata = {
          title: record.title || 'YouTube Video',
          source: record.source || 'YouTube',
          publishedDate: record.publishedDate || new Date().toISOString().split('T')[0]
        };
      }

      const category = await this.determineCategory(
        metadata.title || record.title,
        metadata.source || record.source,
        metadata.description
      );

      // Update Notion record with full metadata
      const updates: any = {
        contentType: 'YouTube Video' as const,
        category,
        featured: category.includes('AI') || category.includes('Future of Work'), // Auto-feature AI content
        processed: true
      };

      // Only update empty fields to preserve user input
      if (!record.title && metadata.title) updates.title = metadata.title;
      if (!record.source && metadata.source) updates.source = metadata.source;
      if (!record.publishedDate && metadata.publishedDate) {
        updates.publishedDate = metadata.publishedDate.split('T')[0];
      }
      if (!record.description && metadata.description) {
        updates.description = metadata.description;
      }

      await this.enhancedNotionClient.updateRecord(record.id, updates);

      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: 'YouTube Video',
        success: true,
        extracted: {
          title: updates.title || record.title,
          source: updates.source || record.source,
          publishedDate: updates.publishedDate || record.publishedDate,
          category,
          description: updates.description || record.description,
          featured: updates.featured
        }
      };
    } catch (error) {
      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: 'YouTube Video',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process news article content
   */
  private async processNewsContent(record: EnhancedNotionItem): Promise<ProcessingResult> {
    try {
      // Extract content using AI
      const extractedContent = await this.contentExtractor.extractFromUrl(record.sourceUrl);
      
      if (!extractedContent.success) {
        throw new Error(extractedContent.error || 'Content extraction failed');
      }

      const category = await this.determineCategory(
        extractedContent.title,
        extractedContent.source,
        ''
      );

      // Prepare updates (only update empty fields)
      const updates: any = {
        contentType: 'News Article' as const,
        category,
        featured: category.includes('AI') || category.includes('Future of Work'), // Auto-feature AI content
        processed: true
      };

      if (!record.title && extractedContent.title) {
        updates.title = extractedContent.title;
      }
      
      if (!record.source && extractedContent.source) {
        updates.source = extractedContent.source;
      }
      
      if (!record.publishedDate && extractedContent.publishedDate) {
        updates.publishedDate = extractedContent.publishedDate;
      }

      // Update Notion record
      await this.enhancedNotionClient.updateRecord(record.id, updates);

      // Create markdown file for news articles
      // TODO: Implement markdown file creation for news articles
      
      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: 'News Article',
        success: true,
        extracted: {
          title: updates.title || record.title,
          source: updates.source || record.source,
          publishedDate: updates.publishedDate || record.publishedDate,
          category,
          featured: updates.featured
        }
      };
    } catch (error) {
      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: 'News Article',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process all incomplete records
   */
  async processAllContent(): Promise<UnifiedProcessingStats> {
    console.log('🚀 Starting unified content processing...');

    try {
      const incompleteRecords = await this.enhancedNotionClient.getIncompleteRecords();
      
      if (incompleteRecords.length === 0) {
        console.log('✅ No incomplete records found');
        return {
          total: 0,
          successful: 0,
          failed: 0,
          newsArticles: 0,
          youtubeVideos: 0,
          results: []
        };
      }

      console.log(`📊 Found ${incompleteRecords.length} records to process`);
      
      const results: ProcessingResult[] = [];
      let successful = 0;
      let failed = 0;
      let newsArticles = 0;
      let youtubeVideos = 0;

      // Process each record
      for (const record of incompleteRecords) {
        const result = await this.processContentRecord(record);
        results.push(result);
        
        if (result.success) {
          successful++;
          if (result.contentType === 'News Article') {
            newsArticles++;
          } else {
            youtubeVideos++;
          }
        } else {
          failed++;
        }

        // Add delay between processing to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const stats = {
        total: incompleteRecords.length,
        successful,
        failed,
        newsArticles,
        youtubeVideos,
        results
      };

      console.log(`✅ Unified processing complete: ${successful} successful, ${failed} failed`);
      console.log(`📰 News articles: ${newsArticles}, 🎥 YouTube videos: ${youtubeVideos}`);
      
      return stats;

    } catch (error) {
      console.error('❌ Error in unified content processing:', error);
      throw error;
    }
  }

  /**
   * Auto-populate Content Type for all records that don't have it
   */
  async autoPopulateContentTypes(): Promise<{ updated: number; errors: string[] }> {
    console.log('🔄 Auto-populating Content Types...');
    
    try {
      const allContent = await this.enhancedNotionClient.getAllContent();
      const recordsNeedingType = allContent.filter(item => !item.contentType);
      
      if (recordsNeedingType.length === 0) {
        console.log('✅ All records already have Content Type set');
        return { updated: 0, errors: [] };
      }

      console.log(`📊 Found ${recordsNeedingType.length} records needing Content Type`);
      
      let updated = 0;
      const errors: string[] = [];

      for (const record of recordsNeedingType) {
        try {
          await this.enhancedNotionClient.autoPopulateContentType(record.id, record.sourceUrl);
          updated++;
          console.log(`✅ Updated Content Type for: ${record.sourceUrl}`);
        } catch (error) {
          const errorMsg = `Failed to update ${record.id}: ${error}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }

        // Add delay to be respectful to Notion API
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`✅ Auto-population complete: ${updated} updated, ${errors.length} errors`);
      return { updated, errors };

    } catch (error) {
      console.error('❌ Error in auto-populating Content Types:', error);
      throw error;
    }
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats(): Promise<{
    totalRecords: number;
    newsArticles: number;
    youtubeVideos: number;
    incompleteRecords: number;
    processedRecords: number;
  }> {
    try {
      const [allContent, incompleteRecords] = await Promise.all([
        this.enhancedNotionClient.getAllContent(),
        this.enhancedNotionClient.getIncompleteRecords()
      ]);

      const newsArticles = allContent.filter(item => item.contentType === 'News Article').length;
      const youtubeVideos = allContent.filter(item => item.contentType === 'YouTube Video').length;
      const processedRecords = allContent.filter(item => item.processed).length;

      return {
        totalRecords: allContent.length,
        newsArticles,
        youtubeVideos,
        incompleteRecords: incompleteRecords.length,
        processedRecords
      };
    } catch (error) {
      console.error('❌ Failed to get processing stats:', error);
      return {
        totalRecords: 0,
        newsArticles: 0,
        youtubeVideos: 0,
        incompleteRecords: 0,
        processedRecords: 0
      };
    }
  }
}

export default UnifiedContentService; 