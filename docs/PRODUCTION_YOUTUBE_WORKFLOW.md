# Production YouTube Video Management Workflow

This document explains how to manage YouTube videos in the production environment where Vercel has read-only file systems.

## How It Works

### Development Environment
- ✅ Videos can be added directly through the admin panel
- ✅ Files are created automatically
- ✅ Metadata is fetched via YouTube API

### Production Environment (Vercel)
- ⚠️ Admin panel validates and logs video submissions
- ❌ Files cannot be created due to read-only filesystem
- 🔧 Manual process required to add videos

## Production Workflow

### Step 1: Submit Video via Admin Panel
1. Go to your admin dashboard: `https://www.futurefast.ai/admin`
2. Navigate to "YouTube Videos" section
3. Add your YouTube URL and settings
4. Click "Add YouTube Video"
5. Note the success message: "Video submission received. Manual processing required in production."

### Step 2: Check Vercel Logs (Optional)
```bash
# Get latest deployment
vercel ls

# Check logs for video submissions
vercel logs [deployment-url]
```

Look for log entries like:
```
📝 [YouTube Add API] Video to be added (production): {
  url: "https://www.youtube.com/watch?v=VIDEO_ID",
  videoId: "VIDEO_ID",
  category: "Interview",
  featured: false,
  timestamp: "2025-08-21T18:30:00.000Z"
}
```

### Step 3: Add Video Manually (Local Development)

#### Method A: Use Helper Scripts
```bash
# Check for missing video files
node scripts/check-missing-videos.js

# Create missing video file templates
node scripts/create-missing-videos.js
```

#### Method B: Manual File Creation
1. **Add to index file**: Edit `content/youtube/index.md`
```yaml
videos:
  - slug: video-[VIDEO_ID]
    category: Interview
    featured: false
```

2. **Create video file**: Create `content/youtube/videos/video-[VIDEO_ID].md`
```yaml
---
url: https://www.youtube.com/watch?v=[VIDEO_ID]
title: "[Pending YouTube API]"
description: "[Will be filled by API]"
category: Interview
featured: false
---
```

### Step 4: Fetch Metadata (Optional)
```bash
# Trigger YouTube API to update metadata
curl "http://localhost:3000/api/youtube?refresh=true"
```

### Step 5: Deploy Changes
```bash
git add .
git commit -m "Add YouTube video: [VIDEO_TITLE]"
git push origin main
```

Vercel will automatically deploy the changes.

## Troubleshooting

### Video Not Appearing
1. Check if video file exists in `content/youtube/videos/`
2. Check if video is listed in `content/youtube/index.md`
3. Verify video URL is correct
4. Check Vercel deployment logs for errors

### Build Errors
- Run `node scripts/check-missing-videos.js` to identify missing files
- Run `node scripts/create-missing-videos.js` to create templates
- Ensure all referenced videos have corresponding files

## Future Improvements

For a more automated production workflow, consider:

1. **Database Integration**: Use Vercel Postgres or Supabase
2. **GitHub API**: Automatically create commits via API
3. **Webhook Integration**: Trigger content updates from external services
4. **CMS Integration**: Use headless CMS like Sanity or Contentful

## Helper Scripts

- `scripts/check-missing-videos.js` - Identifies missing video files
- `scripts/create-missing-videos.js` - Creates template files for missing videos

These scripts help maintain consistency between the index file and individual video files.