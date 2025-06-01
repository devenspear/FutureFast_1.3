// Core types for the automated workflow system
export interface EmailContent {
  subject: string;
  body: string;
  sender: string;
  receivedAt: Date;
  urls: string[];
}

export interface ExtractedContent {
  url: string;
  title?: string;
  description?: string;
  content?: string;
  metadata?: {
    author?: string;
    publishDate?: string;
    domain?: string;
    type?: 'article' | 'video' | 'pdf' | 'report';
  };
}

export interface ProcessedContent {
  title: string;
  description: string;
  url: string;
  category: 'news' | 'catalog' | 'youtube';
  subcategory?: string;
  metadata: {
    source?: string;
    publishedDate?: string;
    type?: string;
    tag?: string;
    featured?: boolean;
  };
  confidence: number; // 0-1 score for classification accuracy
}

export interface WorkflowResult {
  success: boolean;
  processedCount: number;
  errors: string[];
  createdFiles: string[];
  gitCommit?: string;
}

export interface WorkflowConfig {
  openai?: {
    apiKey: string;
    model: string;
  };
  github?: {
    token: string;
    repo: string;
    branch: string;
  };
  email?: {
    webhookSecret: string;
  };
} 