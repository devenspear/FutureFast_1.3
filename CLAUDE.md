# Claude Code Memory File - FutureFast.ai

## Project Information
- **Project Type:** Next.js application with PostgreSQL database and Notion CMS integration
- **Repository:** GitHub - devenspear/FutureFast_1.3
- **Deployment:** Vercel (auto-deployment from main branch)
- **Live Domain:** https://futurefast.ai (also https://www.futurefast.ai)
- **Vercel Project:** deven-projects/future-fast-1-3

## Standard Deployment Workflow for Vercel + GitHub Projects

### CRITICAL: Always Verify Deployment Status
When making changes that need to be deployed to production:

1. **Make code changes locally**
2. **Test locally** (lint, type check, build if needed)
3. **Git commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **🚨 VERIFY DEPLOYMENT IS READY using Vercel CLI:**
   ```bash
   vercel ls
   ```
   - Look for the most recent deployment (top of list)
   - Confirm status shows **"● Ready"** (not Building, Error, etc.)
   - **ONLY mark deployment as complete after seeing "● Ready" status**

5. **Alternative verification methods:**
   ```bash
   vercel status
   vercel --help
   ```

### Environment Configuration
- **Local env file:** `.env.local` (template with placeholders)
- **Production env:** Configured in Vercel dashboard
- **Key services:** Notion API, OpenAI API, YouTube API

### Cron Job System
- **Endpoint:** `/api/cron/ai-processing`
- **Purpose:** Process articles from Notion database
- **Trigger script:** `./trigger-processing.sh`
- **Service:** `UnifiedContentService` in `/lib/unified-content-service.ts`

### Recent Fixes Applied
- **Unicode Character Normalization** (2024-09-08): Added `normalizeText()` function to handle em-dashes and other Unicode characters in article titles
- **YouTube Live URL Support** (2026-01-13): Added `/live/` URL pattern support to all `extractVideoId` functions (lib/youtube-utils.ts, YouTubeModel, youtube-cache.ts, YouTubeSection component)
- **Weekly Intelligence Digest Layout** (2026-01-13): Made date more prominent, moved Companies to left column, Technologies full-width in right column
- **Resource Library Updates** (2026-01-13): Added Deloitte Tech Trends 2026 and Reimagining Tech Services for Agentic AI reports

### Key Features
- **Admin Portal:** https://futurefast.ai/admin (login: check Vercel env vars for ADMIN_USERNAME/ADMIN_PASSWORD)
- **YouTube Management:** Database-backed with auto-metadata fetching via YouTube API
- **Weekly Intelligence Digest:** Disruption Radar integration with client-side caching (1 hour)
- **Resource Library:** File-based catalog in `/content/catalog/` with thumbnails in `/public/uploads/`

### Database
- **Provider:** Neon PostgreSQL (via Vercel Postgres integration)
- **Key Tables:** youtube_videos, briefings
- **Models:** `/src/lib/db/models/`

## Notes for Claude
- Always use `vercel ls` to confirm "● Ready" status before marking deployments complete
- **NEVER say changes are "live" or "deployed" until verifying "● Ready" status**
- If Vercel shows "● Building" status, wait and check again before confirming deployment
- This project requires proper Notion API credentials to run cron job locally
- Use TodoWrite tool for multi-step deployment processes
- **🚨 NEVER provide time estimates in hours or days** - User is not doing the work, Claude is vibe coding 100% of implementations. Time estimates are irrelevant and distracting. Just build it.