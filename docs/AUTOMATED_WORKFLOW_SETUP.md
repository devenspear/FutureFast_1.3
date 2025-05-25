# FutureFast Automated Content Workflow Setup

This guide will walk you through setting up the automated content workflow system for FutureFast.

## 🎯 **What Works Out of the Box**

✅ **Basic content processing** - Works immediately with no setup required  
✅ **URL extraction** - Automatically finds URLs in text  
✅ **Rule-based classification** - Smart categorization without AI  
✅ **Markdown file generation** - Creates properly formatted content files  

## 🚀 **Optional Enhancements (Setup Required)**

### 1. OpenAI Integration (Recommended)
**What it adds:** Much smarter content classification and title/description optimization

#### Setup Steps:
1. **Get OpenAI API Key:**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create account or log in
   - Navigate to API Keys section
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add to Environment Variables:**
   ```bash
   # Add to your .env.local file
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Cost:** ~$0.01-0.05 per content item (very affordable)

### 2. GitHub Auto-Commits (Optional)
**What it adds:** Automatically commits new content files to git

#### Setup Steps:
1. **Create GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select scopes: `repo` (full repository access)
   - Copy the token

2. **Add to Environment Variables:**
   ```bash
   # Add to your .env.local file
   GITHUB_TOKEN=ghp_your-token-here
   GITHUB_REPO=your-username/FutureFast_1.2
   ```

### 3. Email Service Integration (Optional)
**What it adds:** Process content by sending emails

You have several options:

#### Option A: SendGrid (Recommended)
1. **Setup SendGrid:**
   - Create account at [sendgrid.com](https://sendgrid.com)
   - Get API key from Settings → API Keys
   - Set up Inbound Parse webhook

2. **Environment Variables:**
   ```bash
   EMAIL_WEBHOOK_SECRET=your-webhook-secret
   ```

#### Option B: Zapier (Easiest)
1. Create Zapier account
2. Create "Email by Zapier" trigger
3. Connect to webhook (your-domain.com/api/content-workflow)

#### Option C: AWS SES + Lambda
For advanced users who want full control

## 📝 **Environment Variables Setup**

Create or update your `.env.local` file:

```bash
# Required for your existing app
YOUTUBE_API_KEY=your-youtube-key

# Optional: OpenAI (highly recommended)
OPENAI_API_KEY=sk-your-openai-key

# Optional: GitHub auto-commits
GITHUB_TOKEN=ghp_your-github-token
GITHUB_REPO=your-username/your-repo-name

# Optional: Email webhooks
EMAIL_WEBHOOK_SECRET=your-webhook-secret
```

## 🧪 **Testing the System**

### Test 1: Basic API (No setup required)
```bash
curl -X POST http://localhost:3000/api/content-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Check out this amazing AI breakthrough: https://techcrunch.com/some-ai-article",
    "sender": "test@example.com"
  }'
```

### Test 2: Multiple URLs
```bash
curl -X POST http://localhost:3000/api/content-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Two great resources: https://youtube.com/watch?v=abc123 and https://arxiv.org/abs/2024.01234",
    "sender": "curator@futurefast.com"
  }'
```

### Test 3: Email Format
```bash
curl -X POST http://localhost:3000/api/content-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "email": {
      "subject": "New AI Research",
      "body": "Found this interesting paper: https://arxiv.org/abs/2024.01234",
      "from": "researcher@university.edu"
    }
  }'
```

## 📁 **How Content Files are Created**

The system automatically creates files in your existing structure:

```
content/
├── news/           # News articles
│   └── new-ai-breakthrough.md
├── catalog/        # Reports, whitepapers
│   └── future-of-robotics-report.md
└── youtube/        # Videos added to videos.md
    └── videos.md   # Updated with new entries
```

## 🔄 **Usage Workflow**

### Method 1: Direct API (Works now)
Send POST request to `/api/content-workflow` with URLs

### Method 2: Email (After email setup)
Send email to your configured address with URLs in the body

### Method 3: Zapier Integration (After Zapier setup)
Forward emails through Zapier to your API endpoint

## 🛠️ **Setup Priority Recommendations**

1. **Start with:** Just test the basic API (works immediately)
2. **Add OpenAI:** Significant improvement in content quality
3. **Add Email:** If you want email-to-website workflow
4. **Add GitHub:** If you want auto-commits

## 🚨 **Security Notes**

- Keep API keys secret and never commit them to git
- Use webhook secrets for email integrations
- Consider rate limiting for production use
- Test thoroughly before processing important content

## 📞 **Need Help?**

The system is designed to work immediately with basic functionality. Each enhancement is optional and can be added when you're ready.

**Test it now:** The basic API works without any setup required! 