import { EmailContent, WorkflowResult, WorkflowConfig } from './workflow-types';
import { ContentExtractor } from './content-extractor';
import { ContentClassifier } from './content-classifier';
import { ContentGenerator } from './content-generator';

export class ContentWorkflow {
  private extractor: ContentExtractor;
  private classifier: ContentClassifier;
  private generator: ContentGenerator;
  private config: WorkflowConfig;

  constructor(config: WorkflowConfig) {
    this.config = config;
    this.extractor = new ContentExtractor();
    this.classifier = new ContentClassifier(config.openai?.apiKey);
    this.generator = new ContentGenerator();
  }

  async processEmail(emailContent: EmailContent): Promise<WorkflowResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting content workflow for ${emailContent.urls.length} URLs`);

    const result: WorkflowResult = {
      success: false,
      processedCount: 0,
      errors: [],
      createdFiles: [],
    };

    try {
      // Extract content from URLs
      console.log('📥 Extracting content from URLs...');
      const extractedContent = [];
      
      for (const url of emailContent.urls) {
        try {
          const content = await this.extractor.extractFromUrl(url);
          extractedContent.push(content);
          console.log(`✅ Extracted: ${content.title || url}`);
        } catch (error) {
          const errorMsg = `Failed to extract ${url}: ${error}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      if (extractedContent.length === 0) {
        throw new Error('No content could be extracted from the provided URLs');
      }

      // Classify content
      console.log('🧠 Classifying content...');
      const processedContent = [];
      
      for (const content of extractedContent) {
        try {
          const processed = await this.classifier.classifyContent(content);
          
          // Only include content with sufficient confidence
          if (processed.confidence >= 0.5) {
            processedContent.push(processed);
            console.log(`✅ Classified: ${processed.title} -> ${processed.category}/${processed.subcategory}`);
          } else {
            console.log(`⚠️ Low confidence (${processed.confidence}): ${processed.title}`);
          }
        } catch (error) {
          const errorMsg = `Failed to classify ${content.title}: ${error}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      if (processedContent.length === 0) {
        throw new Error('No content passed classification confidence threshold');
      }

      // Generate markdown files
      console.log('📝 Generating markdown files...');
      const createdFiles = await this.generator.generateMarkdownFiles(processedContent);
      result.createdFiles = createdFiles;
      result.processedCount = createdFiles.length;

      console.log(`📁 Created ${createdFiles.length} files:`);
      createdFiles.forEach(file => console.log(`   - ${file}`));

      result.success = true;
      const duration = Date.now() - startTime;
      console.log(`🎉 Workflow completed successfully in ${duration}ms`);
      
      return result;

    } catch (error) {
      result.errors.push(`Workflow failed: ${error}`);
      console.error(`❌ Workflow failed:`, error);
      return result;
    }
  }

  async processTextContent(text: string, sender: string = 'unknown'): Promise<WorkflowResult> {
    // Extract URLs from text
    const urls = this.extractor.extractUrlsFromText(text);
    
    if (urls.length === 0) {
      return {
        success: false,
        processedCount: 0,
        errors: ['No URLs found in the provided text'],
        createdFiles: [],
      };
    }

    // Create email content object
    const emailContent: EmailContent = {
      subject: 'Content Processing Request',
      body: text,
      sender,
      receivedAt: new Date(),
      urls,
    };

    return await this.processEmail(emailContent);
  }
} 