/**
 * Database Type Definitions
 * Type-safe interfaces for all content tables
 */

// ============================================================================
// News Articles
// ============================================================================

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string | null;
  published_date: Date;
  date_confidence: number | null;
  date_extraction_method: string | null;
  date_extraction_notes: string | null;
  category: string | null;
  tags: string[] | null;
  icon: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  needs_review: boolean;
  review_priority: 'Low' | 'Standard' | 'High' | 'Critical' | null;
  reviewed_at: Date | null;
  reviewed_by: string | null;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  processed_by: string;
  processing_notes: string | null;
}

export interface CreateNewsArticle {
  title: string;
  url: string;
  source: string;
  summary?: string;
  published_date: Date | string;
  date_confidence?: number;
  date_extraction_method?: string;
  date_extraction_notes?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  needs_review?: boolean;
  review_priority?: 'Low' | 'Standard' | 'High' | 'Critical';
  created_by?: string;
  processed_by?: string;
  processing_notes?: string;
}

export interface UpdateNewsArticle {
  title?: string;
  url?: string;
  source?: string;
  summary?: string;
  published_date?: Date | string;
  date_confidence?: number;
  date_extraction_method?: string;
  date_extraction_notes?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  needs_review?: boolean;
  review_priority?: 'Low' | 'Standard' | 'High' | 'Critical';
  reviewed_at?: Date | string;
  reviewed_by?: string;
  processing_notes?: string;
}

export interface NewsFilters {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  category?: string;
  needs_review?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}

// ============================================================================
// YouTube Videos
// ============================================================================

export interface YouTubeVideo {
  id: string;
  video_id: string;
  url: string;
  title: string;
  description: string | null;
  channel: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  published_date: Date | null;
  category: string | null;
  tags: string[] | null;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: Date;
  updated_at: Date;
  created_by: string;
  view_count: number;
  last_viewed_at: Date | null;
}

export interface CreateYouTubeVideo {
  video_id: string;
  url: string;
  title: string;
  description?: string;
  channel?: string;
  thumbnail_url?: string;
  duration?: number;
  published_date?: Date | string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  created_by?: string;
}

export interface UpdateYouTubeVideo {
  video_id?: string;
  url?: string;
  title?: string;
  description?: string;
  channel?: string;
  thumbnail_url?: string;
  duration?: number;
  published_date?: Date | string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface YouTubeFilters {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

// ============================================================================
// Resources
// ============================================================================

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  author: string | null;
  source: string | null;
  published_date: Date | null;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: Date;
  updated_at: Date;
  created_by: string;
  download_count: number;
  last_downloaded_at: Date | null;
}

export interface CreateResource {
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  thumbnail_url?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  author?: string;
  source?: string;
  published_date?: Date | string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  created_by?: string;
}

export interface UpdateResource {
  title?: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  thumbnail_url?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  author?: string;
  source?: string;
  published_date?: Date | string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface ResourceFilters {
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  category?: string;
  file_type?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

// ============================================================================
// Static Content
// ============================================================================

export interface StaticContent {
  id: string;
  section: string;
  content: Record<string, any>;
  description: string | null;
  updated_at: Date;
  updated_by: string;
}

export interface CreateStaticContent {
  section: string;
  content: Record<string, any>;
  description?: string;
  updated_by?: string;
}

export interface UpdateStaticContent {
  content?: Record<string, any>;
  description?: string;
  updated_by?: string;
}
