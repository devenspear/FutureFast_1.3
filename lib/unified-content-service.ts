import EnhancedNotionClient, { EnhancedNotionItem } from './enhanced-notion-client';
import { ContentExtractor } from './content-extractor';
import NotionYouTubeService from './notion-youtube-service';
import WebsiteValidationService from './website-validation-service';
import { generateNewsMetadata } from '../src/lib/openai-utils';
import { EnhancedDateExtractor, DateExtractionResult } from '../src/lib/enhanced-date-extractor';
import { DateExtractionNotificationService } from './date-extraction-notifications';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

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
    markdownFile?: string; // Added for news articles
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
  private validationService: WebsiteValidationService;
  private youtubeService: NotionYouTubeService;
  private dateExtractor: EnhancedDateExtractor;
  private notificationService: DateExtractionNotificationService;

  constructor() {
    this.enhancedNotionClient = new EnhancedNotionClient();
    this.contentExtractor = new ContentExtractor();
    this.validationService = new WebsiteValidationService();
    this.youtubeService = new NotionYouTubeService();
    this.dateExtractor = new EnhancedDateExtractor();
    this.notificationService = new DateExtractionNotificationService();
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
   * Determine review priority based on source reliability and date confidence
   */
  private determineReviewPriority(sourceUrl: string, dateResult: DateExtractionResult): 'Critical' | 'High' | 'Standard' | 'Low' {
    const domain = new URL(sourceUrl).hostname.replace('www.', '');

    // Critical priority sources (major tech publications)
    const criticalSources = [
      'techcrunch.com',
      'arstechnica.com',
      'wired.com',
      'theverge.com',
      'engadget.com'
    ];

    // High priority sources
    const highPrioritySources = [
      'venturebeat.com',
      'mashable.com',
      'techradar.com',
      'zdnet.com',
      'aibusiness.com'
    ];

    // Determine base priority from source
    let basePriority: 'Critical' | 'High' | 'Standard' | 'Low' = 'Low';

    if (criticalSources.includes(domain)) {
      basePriority = 'Critical';
    } else if (highPrioritySources.includes(domain)) {
      basePriority = 'High';
    } else {
      basePriority = 'Standard';
    }

    // Adjust priority based on confidence level
    if (dateResult.confidence === 0) {
      // Always critical if no date could be extracted
      return 'Critical';
    } else if (dateResult.confidence < 30) {
      // Upgrade priority for very low confidence
      return basePriority === 'Standard' ? 'High' : 'Critical';
    } else if (dateResult.confidence >= 85) {
      // Downgrade priority for high confidence (unless critical source)
      return basePriority === 'Critical' ? 'High' : 'Low';
    }

    return basePriority;
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
   * Process news article content with enhanced date extraction
   */
  private async processNewsContent(record: EnhancedNotionItem): Promise<ProcessingResult> {
    try {
      // Update status to processing
      await this.enhancedNotionClient.updateProcessingStatus(record.id, 'processing');

      console.log(`📰 Processing news article: ${record.sourceUrl}`);

      // Enhanced date extraction with confidence scoring
      const dateResult = await this.dateExtractor.extractDateWithConfidence(record.sourceUrl);
      console.log(`📅 Date extraction result: ${JSON.stringify(dateResult)}`);

      // Determine review priority based on confidence and source
      const reviewPriority = this.determineReviewPriority(record.sourceUrl, dateResult);

      // Extract content using AI (with fallback)
      let extractedContent: any;
      try {
        extractedContent = await this.contentExtractor.extractFromUrl(record.sourceUrl);
      } catch (error) {
        console.warn('Content extraction failed, using fallback data:', error);
        extractedContent = {
          title: `Article from ${new URL(record.sourceUrl).hostname}`,
          source: new URL(record.sourceUrl).hostname.replace('www.', ''),
          success: true
        };
      }

      if (!extractedContent.success) {
        throw new Error(extractedContent.error || 'Content extraction failed');
      }

      // Create filename from title
      const filename = extractedContent.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Determine basic category
      const category = await this.determineCategory(
        extractedContent.title,
        extractedContent.source,
        ''
      );

      // Skip markdown file creation in serverless environment
      console.log(`ℹ️ Skipping markdown file creation for: ${extractedContent.title} (serverless environment)`);

      // Prepare update data with enhanced date information
      const updateData: any = {
        title: extractedContent.title,
        source: extractedContent.source,
        publishedDate: dateResult.publishedDate.split('T')[0], // Convert to YYYY-MM-DD
        category: category,
        processed: true,
        // Enhanced date extraction fields
        dateConfidence: dateResult.confidence,
        dateExtractionMethod: dateResult.method,
        needsReview: dateResult.needsReview,
        reviewPriority: reviewPriority,
        dateExtractionNotes: dateResult.extractionNotes
      };

      await this.enhancedNotionClient.updateRecord(record.id, updateData);

      // Update status to completed
      await this.enhancedNotionClient.updateProcessingStatus(record.id, 'completed');

      // Log review requirement
      if (dateResult.needsReview) {
        console.log(`⚠️ Article flagged for review: ${extractedContent.title} (Priority: ${reviewPriority}, Confidence: ${dateResult.confidence}%)`);
      } else {
        console.log(`✅ High confidence extraction: ${extractedContent.title} (Confidence: ${dateResult.confidence}%)`);
      }

      // Validate the article is live on website (automated validation)
      console.log(`🔍 Auto-validating article: ${extractedContent.title}`);
      try {
        const validationResult = await this.validationService.validateSpecificArticle(record.id);
        console.log(`✅ Validation complete for ${extractedContent.title}: ${validationResult.status}`);
      } catch (validationError) {
        console.error(`⚠️ Website validation failed for ${extractedContent.title}:`, validationError);
        // Don't fail the entire processing if validation fails
      }

      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: 'News Article',
        success: true,
        extracted: {
          title: extractedContent.title,
          source: extractedContent.source,
          publishedDate: dateResult.publishedDate,
          category: category,
          markdownFile: `${filename}.md`
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to process news record ${record.id}:`, errorMessage);

      // Update status to error with details
      await this.enhancedNotionClient.updateProcessingStatus(record.id, 'error', errorMessage);

      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        contentType: 'News Article',
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Create markdown file from processed content
   */
  private async createMarkdownFile(data: {
    filename: string;
    title: string;
    date: string;
    source: string;
    sourceUrl: string;
    category: string;
    tags?: string[];
    description?: string;
    content: string;
    type: 'news' | 'youtube';
  }): Promise<string> {
    try {
      // Generate filename
      const filePath = path.join(process.cwd(), 'content', data.type, data.filename);

      // Check if file already exists
      try {
        await fs.access(filePath);
        console.log(`📄 Markdown file already exists: ${data.filename}`);
        return data.filename;
      } catch {
        // File doesn't exist, create it
      }

      // Get icon for category
      const icon = this.getIconForCategory(data.category);

      // Create frontmatter
      const frontmatter = {
        title: data.title,
        source: data.source,
        url: data.sourceUrl,
        date: data.date,
        featured: false, // No auto-feature for news articles
        category: data.category,
        icon: icon,
        createdAt: new Date().toISOString(),
        processedBy: 'AI-UnifiedProcessor'
      };

      // Create content
      const content = `This article was automatically processed from ${data.source}.

[Read the full article →](${data.sourceUrl})`;

      // Generate markdown with frontmatter
      const markdownContent = matter.stringify(content, frontmatter);

      // Ensure news directory exists
      const newsDir = path.join(process.cwd(), 'content', data.type);
      await fs.mkdir(newsDir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, markdownContent, 'utf8');
      
      console.log(`✅ Created markdown file: ${data.filename}`);
      return data.filename;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create markdown file:', errorMsg);
      throw new Error(`Failed to create markdown file: ${errorMsg}`);
    }
  }

  /**
   * Generate URL-safe slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  /**
   * Get icon for category
   */
  private getIconForCategory(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      'AI & Future of Work': '🤖',
      'Web3 & Blockchain': '🔗',
      'Robotics & Manufacturing': '🦾',
      'Tech Innovation': '💡',
      'Future of Work': '💼',
      'VR & Metaverse': '🥽',
      'General': '📰'
    };

    return categoryIcons[category] || '📰';
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

      // Send notification alerts for any records needing review
      try {
        const processedRecords = results
          .filter(r => r.success && r.extracted)
          .map(r => ({
            id: r.recordId,
            sourceUrl: r.sourceUrl,
            contentType: r.contentType,
            needsReview: true, // Simplified for this implementation
          })) as EnhancedNotionItem[];

        await this.notificationService.processNewRecordsForAlerts(processedRecords);
      } catch (notificationError) {
        console.error('⚠️ Failed to send review notifications:', notificationError);
        // Don't fail the entire processing if notifications fail
      }

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