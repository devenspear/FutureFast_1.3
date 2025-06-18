import ContentExtractor from './content-extractor';
import NotionClient from './notion-client';

interface ProcessingResult {
  recordId: string;
  sourceUrl: string;
  success: boolean;
  extracted?: {
    title: string;
    source: string;
    publishedDate: string;
  };
  error?: string;
}

interface ProcessingStats {
  total: number;
  successful: number;
  failed: number;
  results: ProcessingResult[];
}

class AIContentService {
  private contentExtractor: ContentExtractor;
  private notionClient: NotionClient;

  constructor() {
    this.contentExtractor = new ContentExtractor();
    this.notionClient = new NotionClient();
  }

  /**
   * Process all incomplete records and extract missing content
   */
  async processIncompleteRecords(): Promise<ProcessingStats> {
    console.log('🚀 Starting AI content extraction for incomplete records...');
    
    try {
      // Get all records that need content extraction
      const incompleteRecords = await this.notionClient.getIncompleteRecords();
      
      if (incompleteRecords.length === 0) {
        console.log('✅ No incomplete records found');
        return {
          total: 0,
          successful: 0,
          failed: 0,
          results: []
        };
      }

      console.log(`📊 Found ${incompleteRecords.length} records to process`);
      
      const results: ProcessingResult[] = [];
      let successful = 0;
      let failed = 0;

      // Process each record
      for (const record of incompleteRecords) {
        try {
          const result = await this.processRecord(record);
          results.push(result);
          
          if (result.success) {
            successful++;
            console.log(`✅ [${successful}/${incompleteRecords.length}] Successfully processed: ${result.sourceUrl}`);
          } else {
            failed++;
            console.log(`❌ [${failed}/${incompleteRecords.length}] Failed to process: ${result.sourceUrl} - ${result.error}`);
          }
          
          // Add a small delay to be respectful to websites
          await this.delay(1000);
          
        } catch (error) {
          failed++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          results.push({
            recordId: record.id,
            sourceUrl: record.sourceUrl,
            success: false,
            error: errorMsg
          });
          console.log(`❌ [${failed}/${incompleteRecords.length}] Error processing ${record.sourceUrl}: ${errorMsg}`);
        }
      }

      const stats: ProcessingStats = {
        total: incompleteRecords.length,
        successful,
        failed,
        results
      };

      console.log(`🎉 Processing complete! ${successful} successful, ${failed} failed out of ${incompleteRecords.length} total`);
      return stats;
      
    } catch (error) {
      console.error('❌ Failed to process incomplete records:', error);
      throw error;
    }
  }

  /**
   * Process a single record
   */
  async processRecord(record: { id: string; sourceUrl: string; title: string; source: string; publishedDate: string }): Promise<ProcessingResult> {
    try {
      // Check if record already has all required fields
      if (record.title && record.source && record.publishedDate) {
        return {
          recordId: record.id,
          sourceUrl: record.sourceUrl,
          success: true,
          extracted: {
            title: record.title,
            source: record.source,
            publishedDate: record.publishedDate
          }
        };
      }

      // Extract content using AI
      const extractedContent = await this.contentExtractor.extractFromUrl(record.sourceUrl);
      
      if (!extractedContent.success) {
        return {
          recordId: record.id,
          sourceUrl: record.sourceUrl,
          success: false,
          error: extractedContent.error || 'Content extraction failed'
        };
      }

      // Prepare updates (only update empty fields)
      const updates: { title?: string; source?: string; publishedDate?: string } = {};
      
      if (!record.title && extractedContent.title) {
        updates.title = extractedContent.title;
      }
      
      if (!record.source && extractedContent.source) {
        updates.source = extractedContent.source;
      }
      
      if (!record.publishedDate && extractedContent.publishedDate) {
        updates.publishedDate = extractedContent.publishedDate;
      }

      // Only update if we have something to update
      if (Object.keys(updates).length > 0) {
        await this.notionClient.updateRecord(record.id, updates);
      }

      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        success: true,
        extracted: {
          title: updates.title || record.title,
          source: updates.source || record.source,
          publishedDate: updates.publishedDate || record.publishedDate
        }
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        success: false,
        error: errorMsg
      };
    }
  }

  /**
   * Process a single record by URL
   */
  async processRecordByUrl(url: string): Promise<ProcessingResult> {
    try {
      console.log(`🔍 Processing single URL: ${url}`);
      
      const extractedContent = await this.contentExtractor.extractFromUrl(url);
      
      if (!extractedContent.success) {
        return {
          recordId: 'manual',
          sourceUrl: url,
          success: false,
          error: extractedContent.error || 'Content extraction failed'
        };
      }

      return {
        recordId: 'manual',
        sourceUrl: url,
        success: true,
        extracted: {
          title: extractedContent.title,
          source: extractedContent.source,
          publishedDate: extractedContent.publishedDate
        }
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      return {
        recordId: 'manual',
        sourceUrl: url,
        success: false,
        error: errorMsg
      };
    }
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats(): Promise<{ incompleteCount: number; totalCount: number }> {
    try {
      const [incompleteRecords, allRecords] = await Promise.all([
        this.notionClient.getIncompleteRecords(),
        this.notionClient.getNewsArticles()
      ]);

      return {
        incompleteCount: incompleteRecords.length,
        totalCount: allRecords.length
      };
    } catch (error) {
      console.error('❌ Failed to get processing stats:', error);
      return { incompleteCount: 0, totalCount: 0 };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default AIContentService;
export type { ProcessingResult, ProcessingStats }; 