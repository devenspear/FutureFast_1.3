# YouTube API Setup Guide

To get **real publication dates** for YouTube videos instead of mock dates, you need a YouTube Data API v3 key.

## Quick Setup (5 minutes)

### 1. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Library**
4. Search for "YouTube Data API v3" and enable it
5. Go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **API Key**
7. Copy your API key

### 2. Add to Your Environment

Create or update your `.env.local` file in the project root:

```bash
YOUTUBE_API_KEY=your_api_key_here
```

### 3. Restart Development Server

```bash
npm run dev
```

## What This Enables

- ✅ **Real publication dates** from YouTube
- ✅ **Accurate video titles** and descriptions
- ✅ **Real channel names**
- ✅ **Proper sorting** (newest videos on left)

## Current Fallback System

Without the API key, the system:
- Uses your configured titles/descriptions from `content/youtube/videos.md`
- Attempts to fetch some data using YouTube's oEmbed API
- Falls back to reasonable date estimates
- Still works perfectly, just without real publication dates

## API Limits

- **Free quota**: 10,000 units/day
- **Per video request**: ~1 unit
- **Current usage**: ~13 videos = 13 units/day
- **Plenty of headroom** for your needs

## Alternative: Manual Date Configuration

If you prefer not to use the API, you can manually add publication dates to your markdown file:

```yaml
- url: "https://www.youtube.com/watch?v=VIDEO_ID"
  title: "Video Title"
  description: "Description"
  category: "Category"
  featured: false
  publishedAt: "2024-12-15T00:00:00Z"  # Add this line
```

The system will use these manual dates when the API is unavailable. 