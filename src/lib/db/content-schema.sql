-- ================================================================
-- FutureFast.ai Content Management System - Database Schema
-- Enterprise-grade, single source of truth for all dynamic content
-- ================================================================

-- News Articles Table
-- Stores all news articles with AI-extracted metadata
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content fields
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  summary TEXT,

  -- Publication metadata
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  date_confidence INTEGER CHECK (date_confidence >= 0 AND date_confidence <= 100),
  date_extraction_method TEXT,
  date_extraction_notes TEXT,

  -- Categorization
  category TEXT,
  tags TEXT[], -- Array of tags
  icon TEXT DEFAULT '📰',

  -- Feature flags
  featured BOOLEAN DEFAULT false,

  -- Status tracking
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Review system (from Notion's date confidence feature)
  needs_review BOOLEAN DEFAULT false,
  review_priority TEXT CHECK (review_priority IN ('Low', 'Standard', 'High', 'Critical')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT DEFAULT 'admin',

  -- AI processing metadata
  processed_by TEXT DEFAULT 'AI-ContentExtractor',
  processing_notes TEXT
);

-- YouTube Videos Table
-- Stores all video content with metadata
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- YouTube specifics
  video_id TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,

  -- Core content fields
  title TEXT NOT NULL,
  description TEXT,
  channel TEXT,

  -- Media metadata
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  published_date TIMESTAMP WITH TIME ZONE,

  -- Categorization
  category TEXT,
  tags TEXT[],

  -- Feature flags
  featured BOOLEAN DEFAULT false,

  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT DEFAULT 'admin',

  -- View statistics (optional future feature)
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- Resource Library Table
-- Stores PDFs, whitepapers, reports, etc.
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content fields
  title TEXT NOT NULL,
  description TEXT,

  -- File metadata
  file_url TEXT, -- Can be Vercel Blob URL or external URL
  file_type TEXT, -- 'pdf', 'video', 'article', 'whitepaper', etc.
  file_size BIGINT, -- in bytes

  -- Visual
  thumbnail_url TEXT,
  cover_image_url TEXT,

  -- Categorization
  category TEXT,
  tags TEXT[],

  -- Attribution
  author TEXT,
  source TEXT,
  published_date TIMESTAMP WITH TIME ZONE,

  -- Feature flags
  featured BOOLEAN DEFAULT false,

  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT DEFAULT 'admin',

  -- Download tracking (optional future feature)
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMP WITH TIME ZONE
);

-- Static Content Table (Optional - for hero, about, etc.)
-- Stores rarely-changing content that could be moved from markdown
CREATE TABLE IF NOT EXISTS static_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifier
  section TEXT NOT NULL UNIQUE, -- 'hero', 'about', 'why_we_exist', etc.

  -- Content (stored as JSONB for flexibility)
  content JSONB NOT NULL,

  -- Metadata
  description TEXT, -- Admin note about what this section is

  -- Audit fields
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT DEFAULT 'admin'
);

-- ================================================================
-- INDEXES for Performance
-- ================================================================

-- News Articles Indexes
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news_articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_news_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_needs_review ON news_articles(needs_review) WHERE needs_review = true;
CREATE INDEX IF NOT EXISTS idx_news_url ON news_articles(url); -- For duplicate checking

-- YouTube Videos Indexes
CREATE INDEX IF NOT EXISTS idx_youtube_published_date ON youtube_videos(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_featured ON youtube_videos(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_youtube_status ON youtube_videos(status);
CREATE INDEX IF NOT EXISTS idx_youtube_category ON youtube_videos(category);
CREATE INDEX IF NOT EXISTS idx_youtube_video_id ON youtube_videos(video_id);

-- Resources Indexes
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_file_type ON resources(file_type);

-- Full-text search indexes (PostgreSQL specific)
CREATE INDEX IF NOT EXISTS idx_news_search ON news_articles USING gin(to_tsvector('english', title || ' ' || COALESCE(summary, '')));
CREATE INDEX IF NOT EXISTS idx_youtube_search ON youtube_videos USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ================================================================
-- TRIGGERS for auto-updating timestamps
-- ================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all content tables
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_youtube_videos_updated_at ON youtube_videos;
CREATE TRIGGER update_youtube_videos_updated_at
  BEFORE UPDATE ON youtube_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_static_content_updated_at ON static_content;
CREATE TRIGGER update_static_content_updated_at
  BEFORE UPDATE ON static_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- VIEWS for common queries
-- ================================================================

-- Featured content across all types
CREATE OR REPLACE VIEW featured_content AS
  SELECT
    'news' as content_type,
    id,
    title,
    published_date as date,
    category,
    url,
    featured
  FROM news_articles
  WHERE featured = true AND status = 'published'

  UNION ALL

  SELECT
    'video' as content_type,
    id,
    title,
    published_date as date,
    category,
    url,
    featured
  FROM youtube_videos
  WHERE featured = true AND status = 'published'

  ORDER BY date DESC;

-- Recent content (last 30 days)
CREATE OR REPLACE VIEW recent_content AS
  SELECT
    'news' as content_type,
    id,
    title,
    published_date as date,
    category,
    created_at
  FROM news_articles
  WHERE status = 'published'
    AND published_date > CURRENT_TIMESTAMP - INTERVAL '30 days'

  UNION ALL

  SELECT
    'video' as content_type,
    id,
    title,
    published_date as date,
    category,
    created_at
  FROM youtube_videos
  WHERE status = 'published'
    AND published_date > CURRENT_TIMESTAMP - INTERVAL '30 days'

  ORDER BY date DESC;

-- Content needing review (from date extraction confidence scoring)
CREATE OR REPLACE VIEW content_needing_review AS
  SELECT
    id,
    title,
    url,
    needs_review,
    review_priority,
    date_confidence,
    date_extraction_method,
    published_date
  FROM news_articles
  WHERE needs_review = true
    AND status != 'archived'
  ORDER BY
    CASE review_priority
      WHEN 'Critical' THEN 1
      WHEN 'High' THEN 2
      WHEN 'Standard' THEN 3
      WHEN 'Low' THEN 4
    END,
    created_at DESC;

-- ================================================================
-- COMMENTS for documentation
-- ================================================================

COMMENT ON TABLE news_articles IS 'Stores all news articles with AI-extracted metadata and date confidence scoring';
COMMENT ON TABLE youtube_videos IS 'Stores all YouTube video content with metadata';
COMMENT ON TABLE resources IS 'Stores resource library items (PDFs, whitepapers, etc.)';
COMMENT ON TABLE static_content IS 'Stores rarely-changing static content (hero, about sections, etc.)';

COMMENT ON COLUMN news_articles.date_confidence IS 'Confidence score (0-100) for extracted publication date';
COMMENT ON COLUMN news_articles.review_priority IS 'Priority level for manual review based on confidence and source reliability';
COMMENT ON VIEW content_needing_review IS 'Articles flagged for manual review due to low date confidence or unreliable sources';
