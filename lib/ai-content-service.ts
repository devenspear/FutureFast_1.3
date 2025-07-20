import ContentExtractor from './content-extractor';
import NotionClient from './notion-client';
import { ContentClassifier } from './content-classifier';
import NotionYouTubeService from './notion-youtube-service';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface ProcessingResult {
  recordId: string;
  sourceUrl: string;
  success: boolean;
  extracted?: {
    title: string;
    source: string;
    publishedDate: string;
    category?: string;
    subcategory?: string;
    markdownFile?: string;
  };
  error?: string;
}

interface ProcessingStats {
  total: number;
  successful: number;
  failed: number;
  results: ProcessingResult[];
  markdownFilesCreated: number;
  gitCommitted?: boolean;
  commitMessage?: string;
}

class AIContentService {
  private contentExtractor: ContentExtractor;
  private notionClient: NotionClient;
  private contentClassifier: ContentClassifier;
  private youtubeService: NotionYouTubeService;

  constructor() {
    this.contentExtractor = new ContentExtractor();
    this.notionClient = new NotionClient();
    this.contentClassifier = new ContentClassifier();
    this.youtubeService = new NotionYouTubeService();
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
          results: [],
          markdownFilesCreated: 0
        };
      }

      console.log(`📊 Found ${incompleteRecords.length} records to process`);
      
      const results: ProcessingResult[] = [];
      let successful = 0;
      let failed = 0;
      let markdownFilesCreated = 0;
      const newMarkdownFiles: string[] = [];

      // Process each record
      for (const record of incompleteRecords) {
        try {
          const result = await this.processRecord(record);
          results.push(result);
          
          if (result.success) {
            successful++;
            if (result.extracted?.markdownFile) {
              markdownFilesCreated++;
              newMarkdownFiles.push(result.extracted.markdownFile);
            }
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
        results,
        markdownFilesCreated
      };

      console.log(`🎉 Processing complete! ${successful} successful, ${failed} failed out of ${incompleteRecords.length} total`);
      console.log(`📄 Created ${markdownFilesCreated} markdown files`);

      // Commit new files to GitHub if any were created
      if (newMarkdownFiles.length > 0 && process.env.GITHUB_TOKEN) {
        try {
          const commitResult = await this.commitToGitHub(newMarkdownFiles, successful);
          stats.gitCommitted = commitResult.success;
          stats.commitMessage = commitResult.message;
          console.log(`📤 ${commitResult.success ? 'Successfully committed' : 'Failed to commit'} to GitHub: ${commitResult.message}`);
        } catch (error) {
          console.warn(`⚠️ GitHub commit failed:`, error);
          stats.gitCommitted = false;
          stats.commitMessage = 'GitHub commit failed';
        }
      } else if (newMarkdownFiles.length > 0) {
        console.log(`ℹ️ GitHub token not configured - skipping auto-commit of ${newMarkdownFiles.length} files`);
      }

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
        console.log(`🔍 Record ${record.id} already complete, checking if markdown file exists...`);
        
        // Try to create markdown file even for complete records if it doesn't exist
        const markdownFile = await this.createMarkdownFile({
          title: record.title,
          source: record.source,
          publishedDate: record.publishedDate,
          url: record.sourceUrl,
          category: 'Tech Innovation', // Default category for existing records
          subcategory: 'General'
        });

        return {
          recordId: record.id,
          sourceUrl: record.sourceUrl,
          success: true,
          extracted: {
            title: record.title,
            source: record.source,
            publishedDate: record.publishedDate,
            category: 'Tech Innovation',
            subcategory: 'General',
            markdownFile
          }
        };
      }

      console.log(`🔍 Processing incomplete record: ${record.sourceUrl}`);

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

      // Auto-categorize the content
      console.log(`🤖 Auto-categorizing content from ${record.sourceUrl}...`);
      const category = await this.categorizeContent({
        title: extractedContent.title,
        description: '', // We don't extract descriptions yet
        url: record.sourceUrl
      });

      console.log(`📂 Categorized as: ${category.category} / ${category.subcategory}`);

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

      // Only update Notion if we have something to update
      if (Object.keys(updates).length > 0) {
        await this.notionClient.updateRecord(record.id, updates);
      }

      // Create markdown file
      const finalTitle = updates.title || record.title;
      const finalSource = updates.source || record.source;
      const finalDate = updates.publishedDate || record.publishedDate;

      const markdownFile = await this.createMarkdownFile({
        title: finalTitle,
        source: finalSource,
        publishedDate: finalDate,
        url: record.sourceUrl,
        category: category.category,
        subcategory: category.subcategory,
        featured: category.featured
      });

      console.log(`📄 Created markdown file: ${markdownFile}`);

      return {
        recordId: record.id,
        sourceUrl: record.sourceUrl,
        success: true,
        extracted: {
          title: finalTitle,
          source: finalSource,
          publishedDate: finalDate,
          category: category.category,
          subcategory: category.subcategory,
          markdownFile
        }
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error processing record ${record.id}:`, errorMsg);
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
   * Get processing statistics including YouTube data
   */
  async getProcessingStats(): Promise<{ 
    incompleteCount: number; 
    totalCount: number; 
    youtubeCount: number;
    totalNotionRecords: number;
  }> {
    try {
      const [incompleteRecords, allRecords, youtubeStats] = await Promise.all([
        this.notionClient.getIncompleteRecords(),
        this.notionClient.getNewsArticles(),
        this.youtubeService.getProcessingStats()
      ]);

      return {
        incompleteCount: incompleteRecords.length,
        totalCount: allRecords.length,
        youtubeCount: youtubeStats.youtubeRecordCount,
        totalNotionRecords: youtubeStats.totalNotionRecords
      };
    } catch (error) {
      console.error('❌ Failed to get processing stats:', error);
      return { 
        incompleteCount: 0, 
        totalCount: 0, 
        youtubeCount: 0,
        totalNotionRecords: 0 
      };
    }
  }

  /**
   * Process both news and YouTube content from Notion
   */
  async processAllContent(): Promise<{
    newsStats: ProcessingStats;
    youtubeStats: any;
    summary: string;
  }> {
    console.log('🚀 Starting comprehensive Notion content processing...');

    try {
      // Process news content (excluding YouTube URLs)
      const newsStats = await this.processIncompleteRecords();
      
      // Process YouTube content
      const youtubeStats = await this.youtubeService.processAllYouTubeRecords();

      const summary = `Content processing complete:
        • News articles: ${newsStats.successful} processed, ${newsStats.failed} failed
        • YouTube videos: ${youtubeStats.successful} processed, ${youtubeStats.failed} failed
        • Total: ${newsStats.successful + youtubeStats.successful} items processed successfully`;

      console.log(summary);

      return {
        newsStats,
        youtubeStats,
        summary
      };
    } catch (error) {
      console.error('❌ Error processing all content:', error);
      throw error;
    }
  }

  /**
   * Auto-categorize content using AI
   */
  private async categorizeContent(content: { title: string; description: string; url: string }): Promise<{
    category: string;
    subcategory: string;
    featured: boolean;
  }> {
    try {
      // Use OpenAI to categorize the content
      const prompt = `
Analyze this content for a technology website focused on AI, Web3, Robotics, and future trends.

URL: ${content.url}
Title: ${content.title}
Description: ${content.description}

Categorize this content:

Subcategory options: AI, Web3, Robotics, Future of Work, Metaverse, Tech Innovation, Blockchain, Crypto, Real Estate, Culture, Workforce, Quantum Computing, VR/AR

Also determine:
- Whether it should be featured (true/false) - feature AI, breakthrough tech, or major industry news  
- Icon emoji that represents the content

Respond with valid JSON only:
{
  "subcategory": "AI|Web3|Robotics|Future of Work|Metaverse|Tech Innovation|Blockchain|Crypto|Real Estate|Culture|Workforce|Quantum Computing|VR/AR",
  "featured": true|false,
  "icon": "🤖|🌐|🦾|💼|🥽|💡|⛓️|₿|🏢|🎭|👥|⚛️|📱"
}
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      let responseContent = data.choices[0].message.content;
      
      // Handle markdown-wrapped JSON responses
      if (responseContent.includes('```json')) {
        responseContent = responseContent.replace(/```json\s*/, '').replace(/\s*```/, '');
      }
      
      const result = JSON.parse(responseContent);

      return {
        category: result.subcategory || 'Tech Innovation',
        subcategory: result.subcategory || 'Tech Innovation', 
        featured: result.featured || false
      };
    } catch (error) {
      console.error('❌ AI categorization failed, using fallback:', error);
      return this.fallbackCategorization(content);
    }
  }

  /**
   * Fallback categorization using rule-based approach
   */
  private fallbackCategorization(content: { title: string; description: string; url: string }): {
    category: string;
    subcategory: string;
    featured: boolean;
  } {
    const title = content.title.toLowerCase();
    const url = content.url.toLowerCase();
    
    if (title.includes('ai') || title.includes('artificial intelligence') || title.includes('gpt') || title.includes('machine learning')) {
      return { category: 'AI', subcategory: 'AI', featured: true };
    } else if (title.includes('web3') || title.includes('blockchain') || title.includes('crypto') || title.includes('bitcoin')) {
      return { category: 'Web3', subcategory: 'Web3', featured: false };
    } else if (title.includes('robot') || title.includes('automation') || title.includes('manufacturing')) {
      return { category: 'Robotics', subcategory: 'Robotics', featured: false };
    } else if (title.includes('future of work') || title.includes('remote work') || title.includes('employment')) {
      return { category: 'Future of Work', subcategory: 'Future of Work', featured: false };
    } else {
      return { category: 'Tech Innovation', subcategory: 'Tech Innovation', featured: false };
    }
  }

  /**
   * Create markdown file from processed content
   */
  private async createMarkdownFile(data: {
    title: string;
    source: string;
    publishedDate: string;
    url: string;
    category: string;
    subcategory: string;
    featured?: boolean;
  }): Promise<string> {
    try {
      // Generate filename
      const slug = this.generateSlug(data.title);
      const datePrefix = new Date(data.publishedDate).toISOString().split('T')[0];
      const fileName = `${datePrefix}-${slug}.md`;
      const filePath = path.join(process.cwd(), 'content/news', fileName);

      // Check if file already exists
      try {
        await fs.access(filePath);
        console.log(`📄 Markdown file already exists: ${fileName}`);
        return fileName;
      } catch {
        // File doesn't exist, create it
      }

      // Get icon for category
      const icon = this.getIconForCategory(data.category);

      // Create frontmatter
      const frontmatter = {
        title: data.title,
        source: data.source,
        url: data.url,
        publishedDate: data.publishedDate,
        featured: data.featured || false,
        category: data.category,
        subcategory: data.subcategory,
        icon: icon,
        createdAt: new Date().toISOString(),
        processedBy: 'AI-AutoProcessor'
      };

      // Create content
      const content = `This article was automatically processed from ${data.source}.

[Read the full article →](${data.url})`;

      // Generate markdown with frontmatter
      const markdownContent = matter.stringify(content, frontmatter);

      // Ensure news directory exists
      const newsDir = path.join(process.cwd(), 'content/news');
      await fs.mkdir(newsDir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, markdownContent, 'utf8');
      
      console.log(`✅ Created markdown file: ${fileName}`);
      return fileName;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create markdown file:', errorMsg);
      throw new Error(`Failed to create markdown file: ${errorMsg}`);
    }
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  }

  /**
   * Get appropriate icon for category
   */
  private getIconForCategory(category: string): string {
    const iconMap: Record<string, string> = {
      'AI': '🤖',
      'Web3': '🌐',
      'Robotics': '🦾',
      'Future of Work': '💼',
      'Metaverse': '🥽',
      'Tech Innovation': '💡',
      'Blockchain': '⛓️',
      'Crypto': '₿',
      'Real Estate': '🏢',
      'Culture': '🎭',
      'Workforce': '👥',
      'Quantum Computing': '⚛️',
      'VR/AR': '📱'
    };
    
    return iconMap[category] || '📰';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Commit new markdown files to GitHub repository
   */
  private async commitToGitHub(files: string[], successful: number): Promise<{ success: boolean; message: string }> {
    try {
      const token = process.env.GITHUB_TOKEN;
      const repo = process.env.GITHUB_REPO || 'devenspear/FutureFast_1.3';
      const branch = process.env.GITHUB_BRANCH || 'main';

      if (!token) {
        throw new Error('GitHub token not configured');
      }

      console.log(`📤 Committing ${files.length} files to GitHub...`);

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };

      // Get the current commit SHA for the branch
      const branchResponse = await fetch(`https://api.github.com/repos/${repo}/branches/${branch}`, {
        headers
      });

      if (!branchResponse.ok) {
        throw new Error(`Failed to get branch info: ${branchResponse.statusText}`);
      }

      const branchData = await branchResponse.json();
      const currentCommitSha = branchData.commit.sha;
      const currentTreeSha = branchData.commit.commit.tree.sha;

      // Read file contents and create tree entries
      const treeEntries = [];
      for (const fileName of files) {
        const filePath = path.join(process.cwd(), 'content/news', fileName);
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const contentBase64 = Buffer.from(content).toString('base64');

          treeEntries.push({
            path: `content/news/${fileName}`,
            mode: '100644',
            type: 'blob',
            content: contentBase64
          });
        } catch (error) {
          console.error(`❌ Failed to read file ${fileName}:`, error);
        }
      }

      if (treeEntries.length === 0) {
        return { success: false, message: 'No files to commit' };
      }

      // Create a new tree
      const treeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_tree: currentTreeSha,
          tree: treeEntries
        })
      });

      if (!treeResponse.ok) {
        throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
      }

      const treeData = await treeResponse.json();

      // Create commit message
      const commitMessage = successful === 1 
        ? `🤖 Add news article: ${files[0].replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
        : `🤖 Add ${successful} news articles via AI processing`;

      // Create a new commit
      const commitResponse = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          tree: treeData.sha,
          parents: [currentCommitSha]
        })
      });

      if (!commitResponse.ok) {
        throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
      }

      const commitData = await commitResponse.json();

      // Update the branch reference
      const refResponse = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: commitData.sha
        })
      });

      if (!refResponse.ok) {
        throw new Error(`Failed to update branch: ${refResponse.statusText}`);
      }

      console.log(`✅ Successfully committed ${files.length} files to GitHub`);
      return { 
        success: true, 
        message: `${commitMessage} (${commitData.sha.substring(0, 7)})` 
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ GitHub commit failed:', errorMsg);
      return { success: false, message: errorMsg };
    }
  }
}

export default AIContentService;
export type { ProcessingResult, ProcessingStats }; 