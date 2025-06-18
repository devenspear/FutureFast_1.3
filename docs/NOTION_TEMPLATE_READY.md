# 📰 Ready-to-Use Notion Template

## 🚀 Quick Setup Instructions

1. **Create a new page in Notion**
2. **Add a database**: Type `/database` and choose "Database - Full page"
3. **Copy the structure below** into your database

## 📊 Database Setup

### **Database Name**: "News Articles"

### **Properties** (Add these columns):

| Property Name | Type | Configuration |
|--------------|------|---------------|
| **Title** | Title | (Default - already exists) |
| **Source** | Text | Empty text field |
| **Publication Date** | Date | Date only, no time |
| **Source URL** | URL | URL field |
| **Status** | Select | Add options: "Published" (Green), "Draft" (Gray) |

### **Sample Data to Copy**:

After creating the properties, add these sample articles:

#### Article 1:
- **Title**: OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities
- **Source**: TechCrunch
- **Publication Date**: January 15, 2025
- **Source URL**: https://techcrunch.com/openai-gpt5-announcement
- **Status**: Published

#### Article 2:
- **Title**: Meta's AI Revolution: How Virtual Reality is Changing Work
- **Source**: Forbes
- **Publication Date**: January 12, 2025
- **Source URL**: https://forbes.com/meta-ai-vr-work-transformation
- **Status**: Published

#### Article 3:
- **Title**: Quantum Computing Milestone: IBM Achieves Error-Free Calculations
- **Source**: MIT Technology Review
- **Publication Date**: January 10, 2025
- **Source URL**: https://technologyreview.mit.edu/ibm-quantum-milestone
- **Status**: Published

#### Article 4:
- **Title**: The Future of Autonomous Vehicles: Tesla's New Neural Network
- **Source**: Wired
- **Publication Date**: January 8, 2025
- **Source URL**: https://wired.com/tesla-autonomous-neural-network
- **Status**: Published

#### Article 5:
- **Title**: Apple's Vision Pro 2: Augmented Reality Goes Mainstream
- **Source**: The Verge
- **Publication Date**: January 5, 2025
- **Source URL**: https://theverge.com/apple-vision-pro-2-ar-mainstream
- **Status**: Draft

## 🔗 Getting Your Database ID

1. **Open your database** in Notion
2. **Copy the URL** from your browser address bar
3. **Find the database ID**: It's the 32-character string in the URL

**Example URL**:
```
https://www.notion.so/your-workspace/News-Articles-abc123def456ghi789?v=xyz...
```

**Your Database ID**: `abc123def456ghi789` (the 32-character part)

## ⚙️ Complete .env.local Setup

Add these exact lines to your `.env.local` file:

```bash
# Notion Integration (for news articles)
NOTION_TOKEN=secret_your_token_here
NOTION_DATABASE_ID=your_32_character_database_id_here
```

Replace:
- `secret_your_token_here` with your integration token from Step 1
- `your_32_character_database_id_here` with your database ID from above

## 🎯 Test Your Setup

1. **Restart your dev server**: `npm run dev`
2. **Visit**: `http://localhost:3000/notion-news-test`
3. **You should see**: Your sample articles displayed beautifully!

## ✅ Checklist

- [ ] Created Notion integration at notion.so/my-integrations
- [ ] Copied integration token (starts with `secret_`)
- [ ] Created "News Articles" database with 5 properties
- [ ] Added sample data (5 articles)
- [ ] Shared database with your integration (see next step)
- [ ] Copied database ID from URL
- [ ] Added both tokens to .env.local
- [ ] Restarted development server
- [ ] Tested at /notion-news-test

## 🔑 Share Database with Integration

**IMPORTANT**: Your integration needs permission to access the database:

1. **Open your News Articles database**
2. **Click "Share" button** (top right)
3. **Click "Invite"**
4. **Search for your integration name** ("FutureFast News Integration")
5. **Give it "Can edit" permissions**
6. **Click "Invite"**

Without this step, you'll get permission errors!

## 🎉 You're Done!

Your Notion news integration is now ready. Add new articles to Notion and they'll automatically appear on your website! 