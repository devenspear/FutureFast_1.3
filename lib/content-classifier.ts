import { ExtractedContent, ProcessedContent } from './workflow-types';

export class ContentClassifier {
  private openaiApiKey?: string;

  constructor(openaiApiKey?: string) {
    this.openaiApiKey = openaiApiKey;
  }

  async classifyContent(content: ExtractedContent): Promise<ProcessedContent> {
    // If OpenAI is available, use AI classification
    if (this.openaiApiKey) {
      return await this.aiClassifyContent(content);
    }
    
    // Otherwise, use rule-based classification
    return this.ruleBasedClassifyContent(content);
  }

  private async aiClassifyContent(content: ExtractedContent): Promise<ProcessedContent> {
    try {
      const prompt = `
Analyze this content and classify it for a technology website focused on AI, Web3, Robotics, and future trends.

URL: ${content.url}
Title: ${content.title}
Description: ${content.description}
Domain: ${content.metadata?.domain}

Classify this content into one of these categories:
1. "news" - Recent news articles, announcements, developments
2. "catalog" - Reports, guides, whitepapers, research documents
3. "youtube" - Video content, tutorials, presentations

For the subcategory, choose from: AI, Web3, Robotics, Future of Work, Metaverse, Tech Innovation, Blockchain, Crypto, RealEstate, Culture, Workforce

Also determine:
- Source name (publication/organization)
- Content type (Report, Article, Video, Guide, etc.)
- Whether it should be featured (true/false)
- A cleaned up title (max 80 chars)
- A compelling description (max 200 chars)

Respond with valid JSON only:
{
  "category": "news|catalog|youtube",
  "subcategory": "AI|Web3|Robotics|...",
  "title": "cleaned title",
  "description": "compelling description",
  "source": "source name",
  "type": "Report|Article|Video|Guide",
  "featured": true|false,
  "confidence": 0.0-1.0
}
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return {
        title: result.title || content.title || 'Untitled',
        description: result.description || content.description || '',
        url: content.url,
        category: result.category || 'news',
        subcategory: result.subcategory,
        metadata: {
          source: result.source,
          publishedDate: content.metadata?.publishDate || new Date().toISOString(),
          type: result.type,
          tag: result.subcategory,
          featured: result.featured || false,
        },
        confidence: result.confidence || 0.7,
      };
    } catch (error) {
      console.error('AI classification failed, falling back to rules:', error);
      return this.ruleBasedClassifyContent(content);
    }
  }

  private ruleBasedClassifyContent(content: ExtractedContent): ProcessedContent {
    const domain = content.metadata?.domain?.toLowerCase() || '';
    const title = content.title?.toLowerCase() || '';
    const description = content.description?.toLowerCase() || '';
    const url = content.url.toLowerCase();

    // Category classification
    let category: 'news' | 'catalog' | 'youtube' = 'news';
    let subcategory = 'Tech Innovation';
    let type = 'Article';
    let featured = false;

    // YouTube detection
    if (domain.includes('youtube') || domain.includes('youtu.be')) {
      category = 'youtube';
      type = 'Video';
    }
    // PDF or research content
    else if (url.includes('.pdf') || 
             title.includes('report') || 
             title.includes('whitepaper') || 
             title.includes('research') ||
             domain.includes('researchgate') ||
             domain.includes('arxiv')) {
      category = 'catalog';
      type = 'Report';
    }

    // Subcategory classification based on keywords
    const content_text = `${title} ${description}`.toLowerCase();
    
    if (this.containsKeywords(content_text, ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'llm'])) {
      subcategory = 'AI';
      featured = true; // AI content is often featured
    } else if (this.containsKeywords(content_text, ['web3', 'blockchain', 'crypto', 'bitcoin', 'ethereum', 'defi'])) {
      subcategory = 'Web3';
    } else if (this.containsKeywords(content_text, ['robot', 'automation', 'manufacturing', 'autonomous'])) {
      subcategory = 'Robotics';
    } else if (this.containsKeywords(content_text, ['future of work', 'remote work', 'employment', 'jobs', 'workforce'])) {
      subcategory = 'Future of Work';
    } else if (this.containsKeywords(content_text, ['metaverse', 'vr', 'virtual reality', 'ar', 'augmented reality'])) {
      subcategory = 'Metaverse';
    } else if (this.containsKeywords(content_text, ['real estate', 'property', 'housing', 'construction'])) {
      subcategory = 'RealEstate';
    }

    // Source detection
    let source = content.metadata?.domain || '';
    const knownSources: Record<string, string> = {
      'techcrunch.com': 'TechCrunch',
      'wired.com': 'Wired',
      'forbes.com': 'Forbes',
      'hbr.org': 'Harvard Business Review',
      'mit.edu': 'MIT',
      'stanford.edu': 'Stanford',
      'youtube.com': 'YouTube',
      'arxiv.org': 'arXiv',
    };
    
    source = knownSources[domain] || this.capitalizeWords(domain.replace(/\.(com|org|edu|net)$/, ''));

    return {
      title: content.title || 'Untitled Content',
      description: content.description || 'No description available',
      url: content.url,
      category,
      subcategory,
      metadata: {
        source,
        publishedDate: content.metadata?.publishDate || new Date().toISOString(),
        type,
        tag: subcategory,
        featured,
      },
      confidence: 0.6, // Rule-based has lower confidence than AI
    };
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, letter => letter.toUpperCase());
  }
} 