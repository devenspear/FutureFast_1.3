# YouTube Video Management for FutureFast

This document explains how to use the YouTube video management system to add new video interviews to the FutureFast website.

## Overview

The YouTube video management system allows you to:

1. Add new YouTube videos to the website
2. Automatically fetch metadata (title, description, etc.) from the YouTube API
3. Categorize and feature videos as needed

## Methods for Adding Videos

### Method 1: Web Interface (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   # or for network access
   npm run dev:network
   ```

2. Navigate to the admin section: `http://localhost:3000/admin/youtube`

3. Fill out the form with:
   - YouTube URL (full URL from youtube.com or youtu.be)
   - Category (select from existing or enter a new one)
   - Featured status (check if this is a highlighted video)

4. Click "Add YouTube Video" to submit

The system will:
- Add the video to the `content/youtube/videos.md` file
- Trigger the YouTube API to fetch metadata
- Update the website to display the new video

### Method 2: Command Line Script

For quick additions or batch processing, use the command line script:

```bash
node scripts/add-youtube-video.js <youtube-url> [category] [featured]
```

Examples:
```bash
# Basic usage
node scripts/add-youtube-video.js https://www.youtube.com/watch?v=dQw4w9WgXcQ

# With category
node scripts/add-youtube-video.js https://youtu.be/dQw4w9WgXcQ "Tech Innovation"

# With category and featured flag
node scripts/add-youtube-video.js https://youtu.be/dQw4w9WgXcQ "AI & Future of Work" true
```

### Method 3: Manual Addition

If you prefer to add videos manually:

1. Edit `content/youtube/videos.md`
2. Add a new entry to the `videos` array:
   ```yaml
   - url: "https://www.youtube.com/watch?v=VIDEO_ID"
     title: "[Pending YouTube API]"
     description: "[Will be filled by API]"
     category: "Interview"
     featured: false
   ```
3. Save the file
4. Trigger the YouTube API by visiting `/api/youtube?refresh=true` or restarting the server

## How It Works

1. When you add a video, it's stored in `content/youtube/videos.md` with placeholder metadata
2. The YouTube API is called to fetch the actual video metadata (title, description, etc.)
3. The metadata is cached in `.youtube-cache.json` for performance
4. The website displays the videos with the fetched metadata

## Troubleshooting

If metadata isn't being fetched:

1. Check that your YouTube API key is set in the environment variables
2. Verify the YouTube URL is valid and accessible
3. Try manually triggering a refresh by visiting `/api/youtube?refresh=true`
4. Check the server logs for any API errors

## API Reference

### YouTube API Endpoint

- `GET /api/youtube` - Get all YouTube videos with metadata
- `GET /api/youtube?refresh=true` - Force refresh of YouTube metadata cache

### Admin API Endpoint

- `POST /api/admin/youtube/add` - Add a new YouTube video
  - Body: `{ url: string, category?: string, featured?: boolean }`
  - Requires authentication
