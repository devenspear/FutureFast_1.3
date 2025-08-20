#!/bin/bash

# Trigger Notion article processing on Vercel
# This will process all unprocessed articles and extract their metadata

echo "🚀 Triggering article processing on Vercel..."
echo ""

# Get the CRON secret from local env for security
CRON_SECRET=$(grep CRON_SECRET .env.local | cut -d '=' -f2)

if [ -z "$CRON_SECRET" ]; then
  echo "❌ CRON_SECRET not found in .env.local"
  echo "Add this to your .env.local file:"
  echo "CRON_SECRET=your_secure_cron_secret_here"
  exit 1
fi

# Call the production CRON endpoint
RESPONSE=$(curl -s -X POST \
  "https://future-fast-1-3.vercel.app/api/cron/ai-processing" \
  -H "Authorization: Bearer $CRON_SECRET")

echo "Response: $RESPONSE"
echo ""
echo "✅ Processing triggered. Check your Notion database in a few moments."
echo "The articles should now have:"
echo "  - Title extracted from the webpage"
echo "  - Publication Date extracted"
echo "  - Source name identified"
echo "  - Processed checkbox ✅"