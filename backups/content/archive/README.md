# YouTube Videos Management

This directory contains the configuration for YouTube videos displayed on the FutureFast website.

## Quick Start

1. **Edit videos**: Open `videos.md` and modify the videos list
2. **Add new video**: Copy an existing entry and update the URL, title, description, and category
3. **Save and refresh**: Changes appear automatically on the website

## File Structure

- `videos.md` - Main configuration file with all video data
- `README.md` - This help file

## Adding New Videos

To add a new video, add this format to the `videos:` section in `videos.md`:

```yaml
- url: "https://www.youtube.com/watch?v=VIDEO_ID"
  title: "Your Video Title"
  description: "Brief description of the video content"
  category: "Video Category"
  featured: false
```

## Features

- **Auto-sorting**: Videos automatically sort by publication date (newest first)
- **Real metadata**: When YouTube API is available, real titles, descriptions, and dates are used
- **Fallback support**: If YouTube API is unavailable, your configured data is used
- **Categories**: Videos are organized by category for better navigation
- **Featured videos**: Set `featured: true` to highlight important content

## Categories

Use descriptive categories that match your content themes:
- "AI Technology"
- "Web3 & Blockchain" 
- "Robotics & Manufacturing"
- "Tech Innovation"
- "Digital Strategy"
- etc.

## Notes

- The website updates automatically when you modify `videos.md`
- Video thumbnails and publication dates come from YouTube
- If YouTube API is unavailable, your descriptions and mock dates are used
- Featured videos get a special badge on the website 