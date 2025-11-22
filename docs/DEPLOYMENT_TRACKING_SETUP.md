# Deployment Tracking Setup

This guide explains how to enable real-time deployment tracking in the admin panel.

## Overview

When you add a YouTube video via the admin panel, the system can now:
1. Track the Vercel deployment status in real-time
2. Show deployment progress (queued → building → ready)
3. Provide direct links to the deployment
4. Alert if deployment fails

## Setup Instructions

### 1. Create a Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "FutureFast Admin Deployment Tracking"
4. Set scope to your project or team
5. Copy the token (you'll only see it once!)

### 2. Get Your Vercel Project ID

Run this command in your project directory:
```bash
vercel project ls | grep future-fast
```

Or find it in Vercel dashboard under Project Settings → General → Project ID

### 3. Add Environment Variables

Add these to your Vercel project (via Vercel Dashboard or CLI):

```bash
# Via Vercel CLI:
echo "YOUR_VERCEL_TOKEN_HERE" | vercel env add VERCEL_TOKEN production
echo "YOUR_PROJECT_ID_HERE" | vercel env add VERCEL_PROJECT_ID production

# Also add to preview environment:
echo "YOUR_VERCEL_TOKEN_HERE" | vercel env add VERCEL_TOKEN preview
echo "YOUR_PROJECT_ID_HERE" | vercel env add VERCEL_PROJECT_ID preview
```

**Via Vercel Dashboard:**
1. Go to your project settings
2. Click "Environment Variables"
3. Add:
   - Name: `VERCEL_TOKEN`, Value: (your token)
   - Name: `VERCEL_PROJECT_ID`, Value: (your project ID)
4. Select environments: Production, Preview

### 4. Optional: Add to Local Development

Add to `.env.local`:
```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
```

## How It Works

1. When you add a video in the admin panel:
   - Video is committed to GitHub
   - Commit SHA is returned to the UI
   - UI starts polling `/api/admin/deployment-status?commitSha=XXX`

2. The deployment status API:
   - Calls Vercel API to check deployment status
   - Matches deployment by commit SHA
   - Returns status: queued → building → ready/error

3. The UI displays:
   - Real-time deployment progress
   - Deployment URL when ready
   - Error message if deployment fails

## Without Setup

If you don't configure these variables:
- Video additions will still work normally
- You just won't see real-time deployment tracking
- The system will fall back gracefully

## Troubleshooting

### "Deployment status unknown"
- Check that VERCEL_TOKEN and VERCEL_PROJECT_ID are set
- Verify token has correct permissions
- Check Vercel API rate limits

### Deployment not found
- Wait 10-15 seconds after commit
- GitHub webhook might be delayed
- Check Vercel dashboard directly

### API errors
- Token might be expired
- Check token has access to project
- Verify project ID is correct

## Security Notes

- Never commit VERCEL_TOKEN to git
- Rotate tokens periodically
- Use read-only tokens if possible
- Tokens are only used in API routes (server-side)
