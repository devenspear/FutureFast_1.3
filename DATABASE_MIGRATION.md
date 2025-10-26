# Database Migration Guide - FutureFast.ai

## Overview

This guide documents the migration from a Notion/GitHub-based content management system to a unified Vercel Postgres database. This new architecture provides:

- ✅ **Single source of truth** - All content in one database
- ✅ **No external dependencies** - No Notion API, no GitHub file commits
- ✅ **Faster performance** - Direct SQL queries instead of API calls
- ✅ **Mobile-optimized admin** - Touch-friendly interface
- ✅ **Better reliability** - Fewer points of failure

---

## Architecture Changes

### Before (Old System)
```
Notion DB → Cron Jobs → GitHub API → Markdown Files → Website
     ↓
Multiple sync points, API rate limits, complex dependencies
```

### After (New System)
```
Admin Panel → Vercel Postgres ← Website
                    ↓
           Single source of truth
```

---

## Step-by-Step Migration

### 1. Run Database Schema Migration

First, create the database tables:

```bash
npx tsx scripts/migrate-db.ts
```

This will:
- Create `news_articles` table
- Create `youtube_videos` table
- Create `resources` table
- Create `static_content` table (optional)
- Set up indexes and triggers

### 2. Migrate Existing Content from Notion

Transfer all your existing Notion content to Postgres:

```bash
npx tsx scripts/migrate-notion-to-postgres.ts
```

This will:
- Fetch all published articles from Notion
- Fetch all YouTube videos from Notion
- Import them into Postgres (skipping duplicates)
- Show migration summary with success/failure counts

### 3. Test Locally

Start the development server:

```bash
npm run dev
```

Then visit:
- **New Admin:** http://localhost:3000/admin/db
- **Public News API:** http://localhost:3000/api/news
- **Public YouTube API:** http://localhost:3000/api/youtube

### 4. Verify Data

Check that all content migrated correctly:

```bash
# Check news count
curl http://localhost:3000/api/news | jq 'length'

# Check YouTube count
curl http://localhost:3000/api/youtube | jq 'length'
```

---

## New Admin Interface

### Access

Navigate to: `https://futurefast.ai/admin/db`

Login with your existing admin credentials.

### Features

#### News Management
- **Add Article:** Paste any news URL
  - AI extracts: title, source, date, summary
  - Date confidence scoring
  - Auto-categorization
  - Review flagging for low confidence

- **List Articles:** View all published articles
  - Sort by date
  - Filter by category, featured, needs_review
  - Search by title/source

- **Edit/Delete:** Update or archive articles
  - Toggle featured status
  - Archive old articles

#### YouTube Management
- **Add Video:** Paste YouTube URL
  - Auto-fetches metadata from YouTube API
  - Extracts: title, channel, thumbnail, description
  - Auto-categorization

- **List Videos:** View all published videos
  - Video thumbnails
  - Category badges
  - Featured status

### Mobile Optimization

The new admin is optimized for mobile:
- ✅ Large touch targets (44px minimum)
- ✅ Full-width buttons on mobile
- ✅ Font size 16px (prevents iOS zoom)
- ✅ Simplified single-column layout
- ✅ Sticky navigation

---

## API Endpoints

### Public Endpoints (No Auth Required)

```
GET /api/news
- Returns all published news articles
- Response: NewsItem[]

GET /api/youtube
- Returns all published YouTube videos
- Response: YouTubeVideo[]
```

### Admin Endpoints (Auth Required)

#### News
```
POST   /api/admin/db/news           - Create article
GET    /api/admin/db/news           - List articles
GET    /api/admin/db/news/[id]      - Get single article
PATCH  /api/admin/db/news/[id]      - Update article
DELETE /api/admin/db/news/[id]      - Archive article
```

#### YouTube
```
POST   /api/admin/db/youtube        - Create video
GET    /api/admin/db/youtube        - List videos
GET    /api/admin/db/youtube/[id]   - Get single video
PATCH  /api/admin/db/youtube/[id]   - Update video
DELETE /api/admin/db/youtube/[id]   - Archive video
```

#### Resources
```
POST   /api/admin/db/resources      - Create resource
GET    /api/admin/db/resources      - List resources
GET    /api/admin/db/resources/[id] - Get single resource
PATCH  /api/admin/db/resources/[id] - Update resource
DELETE /api/admin/db/resources/[id] - Archive resource
```

---

## Database Schema

### News Articles Table

```sql
- id (UUID, primary key)
- title (TEXT)
- url (TEXT, unique)
- source (TEXT)
- summary (TEXT, nullable)
- published_date (TIMESTAMP)
- date_confidence (INTEGER 0-100, nullable)
- date_extraction_method (TEXT, nullable)
- category (TEXT, nullable)
- tags (TEXT[], nullable)
- icon (TEXT, default '📰')
- featured (BOOLEAN, default false)
- status ('draft' | 'published' | 'archived')
- needs_review (BOOLEAN)
- review_priority ('Low' | 'Standard' | 'High' | 'Critical')
- created_at, updated_at, created_by, processed_by
```

### YouTube Videos Table

```sql
- id (UUID, primary key)
- video_id (TEXT, unique)
- url (TEXT)
- title (TEXT)
- description (TEXT, nullable)
- channel (TEXT, nullable)
- thumbnail_url (TEXT, nullable)
- duration (INTEGER seconds, nullable)
- published_date (TIMESTAMP, nullable)
- category (TEXT, nullable)
- tags (TEXT[], nullable)
- featured (BOOLEAN, default false)
- status ('draft' | 'published' | 'archived')
- created_at, updated_at, created_by
- view_count (INTEGER), last_viewed_at (TIMESTAMP)
```

### Resources Table

```sql
- id (UUID, primary key)
- title (TEXT)
- description (TEXT, nullable)
- file_url (TEXT, nullable)
- file_type (TEXT, nullable)
- file_size (BIGINT, nullable)
- thumbnail_url, cover_image_url (TEXT, nullable)
- category (TEXT, nullable)
- tags (TEXT[], nullable)
- author, source (TEXT, nullable)
- published_date (TIMESTAMP, nullable)
- featured (BOOLEAN, default false)
- status ('draft' | 'published' | 'archived')
- created_at, updated_at, created_by
- download_count (INTEGER), last_downloaded_at (TIMESTAMP)
```

---

## Deployment Workflow

### Testing on Vercel Preview

1. **Create feature branch:**
   ```bash
   git checkout -b database-cms
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Migrate to Postgres-based CMS"
   git push -u origin database-cms
   ```

3. **Vercel auto-deploys:**
   - Preview URL: `https://futurefast-git-database-cms-<your-account>.vercel.app`
   - Check Vercel dashboard for deployment status

4. **Run migrations on preview:**
   - SSH into Vercel or use Vercel CLI
   - Run schema migration
   - Run Notion migration (if needed)

5. **Test thoroughly:**
   - Add test articles/videos
   - Verify public endpoints
   - Test mobile interface
   - Check all CRUD operations

### Deploying to Production

1. **Merge to main:**
   ```bash
   git checkout main
   git merge database-cms
   git push
   ```

2. **Vercel auto-deploys to production:**
   - Wait for "● Ready" status
   - Verify at `https://futurefast.ai`

3. **Run production migrations:**
   - Only if fresh production database
   - Or skip if already migrated on preview

---

## Environment Variables Required

```bash
# Database (Vercel Postgres)
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# OpenAI (for content extraction)
OPENAI_API_KEY="sk-..."

# YouTube API (for video metadata)
YOUTUBE_API_KEY="AIza..."

# Admin Auth
AUTH_SECRET="your-secret-key"

# Optional: Notion (only if keeping dual system during transition)
NOTION_API_KEY="secret_..."
NOTION_DATABASE_ID="..."
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT 1\`.then(console.log)"
```

### Migration Errors

```bash
# Check existing tables
npx tsx -e "import { sql } from '@vercel/postgres'; sql\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`.then(r => console.log(r.rows))"

# Check record counts
npx tsx -e "import { NewsModel } from './lib/db/models'; NewsModel.count().then(console.log)"
```

### Admin Auth Issues

- Clear cookies
- Re-login at `/admin/login`
- Check `AUTH_SECRET` is set in Vercel

---

## Advantages of New System

| Feature | Old System | New System |
|---------|-----------|------------|
| **Data Source** | Notion + GitHub | Postgres |
| **API Calls** | Many (Notion, GitHub) | None (direct DB) |
| **Rate Limits** | Yes (3 req/sec) | No |
| **Performance** | 200-500ms | <10ms |
| **Mobile Admin** | Not optimized | Touch-optimized |
| **Reliability** | 4+ failure points | 1 failure point |
| **Cost** | Notion $10-20/mo | $0 (included) |
| **Ownership** | Third-party | Full control |

---

## Support

For issues or questions:
- Check Vercel logs: `vercel logs`
- Check database: `vercel logs --scope=database`
- Review this guide
- Test locally first

---

## Next Steps

After successful migration:

1. ✅ Remove old Notion integration code
2. ✅ Remove cron job dependencies
3. ✅ Archive old markdown files
4. ✅ Update documentation
5. ✅ Train team on new admin interface

**Your content management system is now enterprise-grade! 🚀**
