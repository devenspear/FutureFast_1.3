# Fixing Vercel Cron Job for Notion Processing

## Current Issue
The cron job scheduled at `0 13,15,17,19,21,23,1,3 * * *` (every 2 hours) is not running on Vercel because of authentication issues.

## Solution Steps

### 1. Remove CRON_SECRET Authentication for Vercel
Since Vercel uses its own authentication mechanism for cron jobs, you need to modify the cron route to accept Vercel's authentication.

The code has been updated to accept both:
- Local development: `Authorization: Bearer CRONKEY2025`
- Vercel production: `x-vercel-cron-signature` header

### 2. Ensure Environment Variables are Set on Vercel
Add these to your Vercel project settings:
```
NOTION_TOKEN=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
NOTION_DATABASE_ID=216b576203ba80aebcecfad93320f4f7
OPENAI_API_KEY=<your-openai-key>
CRON_SECRET=CRONKEY2025
```

### 3. Deploy the Updated Code
After the cron route update, deploy to Vercel:
```bash
git add .
git commit -m "Fix Vercel cron authentication"
git push
```

### 4. Manual Testing
While waiting for the next cron run, you can manually trigger processing:
```bash
# Trigger unified content processing
curl -X POST https://your-app.vercel.app/api/unified-content \
  -H "Content-Type: application/json" \
  -d '{"action": "process-all"}'
```

## Current Status
- ✅ Notion connection is working
- ✅ YouTube videos ARE being processed (both are already in the system)
- ⚠️ Cron job needs the authentication fix deployed to Vercel
- ✅ Manual processing works fine

## Note on YouTube Videos
The two YouTube URLs in your Notion database have already been successfully processed:
1. "People Don't Know What's Coming" - Chainlink Founder interview
2. Sam Altman on This Past Weekend podcast

They exist as markdown files in `content/youtube/videos/`. The system correctly reports "Video already exists" to prevent duplicates. 