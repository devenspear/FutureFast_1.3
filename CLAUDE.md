# Claude Code Memory File - FutureFast.ai

## Project Information
- **Project Type:** Next.js application with Notion CMS integration
- **Repository:** GitHub - devenspear/FutureFast_1.3  
- **Deployment:** Vercel (auto-deployment from main branch)
- **Domain:** https://future-fast-1-3.vercel.app

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

## Notes for Claude
- Always use `vercel ls` to confirm "● Ready" status before marking deployments complete
- This project requires proper Notion API credentials to run cron job locally
- Use TodoWrite tool for multi-step deployment processes