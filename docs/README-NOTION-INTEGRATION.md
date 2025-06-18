# Notion News Integration - Complete Guide

## 🚀 Quick Start

This integration allows you to manage news articles in Notion and automatically display them on your website. Perfect for content creators who want to use Notion as their CMS!

### What You'll Get
- ✅ Notion database as your news CMS
- ✅ Automatic API integration
- ✅ Beautiful news display page
- ✅ Real-time updates from Notion
- ✅ Responsive design matching your site

## 📋 Prerequisites

- Notion account (free tier works fine)
- Node.js project with Next.js (already set up)
- 5 minutes for setup

## 🛠 Files Created

This integration adds these files to your project:

```
📁 FutureFast.1.3/
├── 📁 lib/
│   └── notion-client.ts              # Notion API client
├── 📁 src/app/
│   ├── 📁 api/notion-news/
│   │   └── route.ts                  # API endpoint
│   └── 📁 notion-news-test/
│       └── page.tsx                  # Test page
├── 📁 docs/
│   ├── notion-integration-setup.md   # Detailed setup guide
│   ├── notion-database-template.md   # Database template
│   └── README-NOTION-INTEGRATION.md  # This file
└── env.sample                        # Updated with Notion vars
```

## 🎯 Data Flow

```mermaid
graph TD
    A[Notion Database] --> B[Notion API]
    B --> C[notion-client.ts]
    C --> D[/api/notion-news]
    D --> E[Test Page]
    E --> F[NewsListSection Component]
    F --> G[Rendered News List]
```

## 🗂 Database Schema

Your Notion database will have these fields:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| **Title** | Title | News headline | ✅ |
| **Source** | Text | Publication (e.g., "TechCrunch") | ✅ |
| **Publication Date** | Date | When published | ✅ |
| **Source URL** | URL | Link to original article | ✅ |
| **Status** | Select | "Published" or "Draft" | ✅ |

## 🚦 Setup Steps

### 1. Quick Setup (5 minutes)
```bash
# 1. Install Notion SDK (already done)
npm install @notionhq/client

# 2. Copy the database template from docs/notion-database-template.md
# 3. Follow setup guide in docs/notion-integration-setup.md
# 4. Add environment variables to .env.local
# 5. Start development server
npm run dev

# 6. Visit test page
open http://localhost:3000/notion-news-test
```

### 2. Environment Variables
Add to your `.env.local`:
```bash
NOTION_TOKEN=secret_abc123...
NOTION_DATABASE_ID=abc123def456...
```

## 🎨 How It Works

### API Endpoint
```
GET /api/notion-news
```
Returns news articles in this format:
```json
[
  {
    "title": "AI Breakthroughs Transform 2025",
    "source": "TechCrunch", 
    "date": "2025-01-15",
    "url": "https://techcrunch.com/example",
    "icon": "📰",
    "featured": false
  }
]
```

### Test Page
Visit `/notion-news-test` to see:
- ✅ Loading state while fetching
- ✅ Error handling with setup instructions
- ✅ Beautiful news list display
- ✅ Responsive design
- ✅ Real-time data from Notion

### Components Used
- `NewsListSection` - Existing component for displaying news
- `NotionClient` - New utility for Notion API calls
- Custom error/loading states

## 🔧 Configuration Options

### Filtering
Edit `lib/notion-client.ts` to customize which articles to fetch:

```typescript
filter: {
  and: [
    {
      property: 'Status',
      select: { equals: 'Published' }
    },
    {
      property: 'Publication Date',
      date: { on_or_after: '2025-01-01' }
    }
  ]
}
```

### Sorting
Change sort order in `lib/notion-client.ts`:
```typescript
sorts: [
  {
    property: 'Publication Date',
    direction: 'descending'
  }
]
```

### Custom Fields
Add these optional fields to your Notion database:
- **Featured** (Checkbox) - Highlight important articles
- **Category** (Select) - Organize by topic
- **Summary** (Text) - Article descriptions
- **Image** (Files) - Article thumbnails

## 🎯 Integration Options

### Option 1: Replace Existing News
Replace your current news system with Notion:
```typescript
// In your main news component
const response = await fetch('/api/notion-news');
const notionNews = await response.json();
```

### Option 2: Combine Sources
Mix Notion news with existing file-based news:
```typescript
const [notionNews, fileNews] = await Promise.all([
  fetch('/api/notion-news'),
  fetch('/api/news')
]);
```

### Option 3: Separate Sections
Use for specific news types (e.g., "Company News" from Notion, "Industry News" from files).

## 🚨 Troubleshooting

### Common Errors

#### "Notion credentials not configured"
```bash
# Add to .env.local:
NOTION_TOKEN=your_token_here
NOTION_DATABASE_ID=your_database_id_here

# Restart server:
npm run dev
```

#### "Failed to fetch news articles"
- ✅ Check integration token is correct
- ✅ Verify database is shared with integration
- ✅ Ensure property names match exactly

#### "No news articles found"
- ✅ Set article Status to "Published"
- ✅ Check database has data
- ✅ Verify property names are correct

### Debug Mode
Add logging to see what's happening:
```typescript
// In notion-client.ts
console.log('Fetching from database:', this.databaseId);
console.log('Response:', response.results);
```

## 🔒 Security

- ✅ API token is server-side only
- ✅ Environment variables not exposed to client
- ✅ Rate limiting handled by Notion
- ✅ No sensitive data in URLs

## 📈 Performance

- ⚡ Fast API responses (~200-500ms)
- ⚡ Client-side caching available
- ⚡ Paginated results for large datasets
- ⚡ Minimal bundle size impact

## 🔮 Future Enhancements

Potential improvements you could add:
- **Rich Text Content** - Full article content from Notion
- **Image Support** - Article thumbnails and covers
- **Categories** - Organize news by topic
- **Search** - Find specific articles
- **Admin Dashboard** - Manage articles without leaving your site

## 📚 Resources

- [Notion API Docs](https://developers.notion.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

## 🆘 Support

If you need help:
1. Check the setup guide: `docs/notion-integration-setup.md`
2. Use the database template: `docs/notion-database-template.md`
3. Test with: `http://localhost:3000/notion-news-test`
4. Check browser console for errors

---

**🎉 That's it!** You now have a powerful Notion-based news system integrated into your website. Add articles to Notion and they'll automatically appear on your site! 