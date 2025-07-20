import NotionClient, { NotionNewsItem } from './notion-client';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface YouTubeProcessingResult {
  recordId: string;
  sourceUrl: string;
  success: boolean;
  videoId?: string;
  slug?: string;
  error?: string;
}

interface YouTubeProcessingStats {
  total: number;
  successful: number;
  failed: number;
  results: YouTubeProcessingResult[];
}

export class NotionYouTubeService {
  private notionClient: NotionClient;

  constructor() {
    this.notionClient = new NotionClient();
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
   * Generate slug for video
   */
  private generateSlug(videoId: string): string {
    return `video-${videoId}`;
  }

  /**
   * Determine category from Notion data or use AI classification
   */
  private async determineCategory(record: NotionNewsItem): Promise<string> {
    // If the Notion record has a source that indicates category, use it
    if (record.source) {
      const source = record.source.toLowerCase();
      if (source.includes('ai') || source.includes('artificial intelligence')) return 'AI & Future of Work';
      if (source.includes('web3') || source.includes('blockchain') || source.includes('crypto')) return 'Web3 & Blockchain';
      if (source.includes('robot') || source.includes('manufacturing')) return 'Robotics & Manufacturing';
      if (source.includes('tech') || source.includes('innovation')) return 'Tech Innovation';
    }

    // If title contains keywords, use them
    if (record.title) {
      const title = record.title.toLowerCase();
      if (title.includes('ai') || title.includes('artificial intelligence') || title.includes('machine learning')) return 'AI & Future of Work';
      if (title.includes('web3') || title.includes('blockchain') || title.includes('crypto') || title.includes('defi')) return 'Web3 & Blockchain';
      if (title.includes('robot') || title.includes('automation') || title.includes('manufacturing')) return 'Robotics & Manufacturing';
      if (title.includes('future of work') || title.includes('remote work') || title.includes('workforce')) return 'Future of Work';
      if (title.includes('metaverse') || title.includes('vr') || title.includes('virtual reality')) return 'VR & Metaverse';
    }

    // Default category
    return 'Interview';
  }

  /**
   * Check if video already exists in YouTube management system
   */
  private async videoExists(videoId: string): Promise<boolean> {
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const indexPath = path.join(process.cwd(), 'content/youtube/index.md');
    
    // Check new structure (individual files)
    if (existsSync(indexPath) && existsSync(videosDir)) {
      try {
        const indexContent = await fs.readFile(indexPath, 'utf8');
        const { data: indexData } = matter(indexContent);
        
        if (Array.isArray(indexData.videos)) {
          for (const video of indexData.videos) {
            if (!video.slug) continue;
            
            const videoPath = path.join(videosDir, `${video.slug}.md`);
            if (existsSync(videoPath)) {
              try {
                const videoContent = await fs.readFile(videoPath, 'utf8');
                const { data: videoData } = matter(videoContent);
                const existingVideoId = this.extractVideoId(videoData.url);
                if (existingVideoId === videoId) {
                  return true;
                }
              } catch {
                // Continue checking other videos
              }
            }
          }
        }
      } catch {
        // If there's an error reading the index, continue to check old structure
      }
    }

    // Check old structure (single file)
    const oldFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
    if (existsSync(oldFilePath)) {
      try {
        const fileContent = await fs.readFile(oldFilePath, 'utf8');
        const { data } = matter(fileContent);
        const videos = data.videos || [];
        
        return videos.some((video: { url: string }) => {
          const existingVideoId = this.extractVideoId(video.url);
          return existingVideoId === videoId;
        });
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Add YouTube video to the management system
   */
  private async addToYouTubeSystem(record: NotionNewsItem, category: string): Promise<{ success: boolean; slug?: string; error?: string }> {
    const videoId = this.extractVideoId(record.sourceUrl);
    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    // Check if video already exists
    if (await this.videoExists(videoId)) {
      return { success: false, error: 'Video already exists in YouTube system' };
    }

    const slug = this.generateSlug(videoId);
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const indexPath = path.join(process.cwd(), 'content/youtube/index.md');

    try {
      // Ensure directories exist
      if (!existsSync(videosDir)) {
        await fs.mkdir(videosDir, { recursive: true });
      }

      // Use new structure (individual files)
      let indexData: any = { videos: [] };
      let indexContentText = '';

      // Read existing index if it exists
      if (existsSync(indexPath)) {
        const indexContent = await fs.readFile(indexPath, 'utf8');
        const parsed = matter(indexContent);
        indexData = parsed.data;
        indexContentText = parsed.content;
        
        if (!Array.isArray(indexData.videos)) {
          indexData.videos = [];
        }
      }

      // Add video to index
      indexData.videos.push({
        slug,
        category,
        featured: false // Default to not featured, can be changed later in admin
      });

      // Write updated index
      const updatedIndexContent = matter.stringify(indexContentText, indexData);
      await fs.writeFile(indexPath, updatedIndexContent, 'utf8');

      // Create individual video file
      const videoData = {
        url: record.sourceUrl,
        title: record.title || "[Pending YouTube API]",
        description: "[Will be filled by API]",
        category,
        featured: false
      };

      const videoContent = matter.stringify('', videoData);
      const videoPath = path.join(videosDir, `${slug}.md`);
      await fs.writeFile(videoPath, videoContent, 'utf8');

      return { success: true, slug };
    } catch (error) {
      console.error('Error adding video to YouTube system:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Process a single YouTube record from Notion
   */
  async processYouTubeRecord(record: NotionNewsItem): Promise<YouTubeProcessingResult> {
    try {
      console.log(`🎥 Processing YouTube record: ${record.sourceUrl}`);

      const videoId = this.extractVideoId(record.sourceUrl);
      if (!videoId) {
        return {
          recordId: record.id,
          sourceUrl: record.sourceUrl,
          success: false,
          error: 'Invalid YouTube URL'
        };
      }

      // Determine category
      const category = await this.determineCategory(record);
      console.log(`📂 Categorized as: ${category}`);

      // Add to YouTube system
      const result = await this.addToYouTubeSystem(record, category);
      
      if (result.success) {
        console.log(`✅ Successfully added YouTube video: ${videoId}`);
        
        // Update Notion record to mark it as processed (optional)
        // You might want to add a "Processed" field to your Notion database
        // await this.notionClient.updateRecord(record.id, { /* mark as processed */ });

        return {
          recordId: record.id,
          sourceUrl: record.sourceUrl,
          success: true,
          videoId,
          slug: result.slug
        };
      } else {
        return {
          recordId: record.id,
          sourceUrl: record.sourceUrl,
          success: false,
          videoId,
          error: result.error
        };
      }
    } catch (error) {
      console.error(`❌ Error processing YouTube record ${record.id}:`, error);
      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process all YouTube records from Notion
   */
  async processAllYouTubeRecords(): Promise<YouTubeProcessingStats> {
    console.log('🚀 Starting YouTube processing from Notion...');

    try {
      const youtubeRecords = await this.notionClient.getYouTubeRecords();
      
      if (youtubeRecords.length === 0) {
        console.log('✅ No YouTube records found in Notion');
        return {
          total: 0,
          successful: 0,
          failed: 0,
          results: []
        };
      }

      console.log(`📊 Found ${youtubeRecords.length} YouTube records to process`);
      
      const results: YouTubeProcessingResult[] = [];
      let successful = 0;
      let failed = 0;

      // Process each record
      for (const record of youtubeRecords) {
        const result = await this.processYouTubeRecord(record);
        results.push(result);
        
        if (result.success) {
          successful++;
        } else {
          failed++;
        }

        // Add delay between processing to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const stats = {
        total: youtubeRecords.length,
        successful,
        failed,
        results
      };

      console.log(`✅ YouTube processing complete: ${successful} successful, ${failed} failed`);
      return stats;

    } catch (error) {
      console.error('❌ Error processing YouTube records:', error);
      throw error;
    }
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats(): Promise<{ youtubeRecordCount: number; totalNotionRecords: number }> {
    try {
      const youtubeRecords = await this.notionClient.getYouTubeRecords();
      const newsRecords = await this.notionClient.getNewsArticles();
      
      return {
        youtubeRecordCount: youtubeRecords.length,
        totalNotionRecords: newsRecords.length + youtubeRecords.length
      };
    } catch (error) {
      console.error('Error getting processing stats:', error);
      return {
        youtubeRecordCount: 0,
        totalNotionRecords: 0
      };
    }
  }
}

export default NotionYouTubeService; 