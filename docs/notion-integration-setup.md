# Notion News Integration Setup Guide

## Overview
This guide will help you set up the Notion integration to automatically fetch news articles from your Notion database and display them on your website.

## Step 1: Create a Notion Database

### 1.1 Create a New Database
1. Open Notion and create a new page
2. Add a "Database - Full page" block
3. Name your database "News Articles" (or any name you prefer)

### 1.2 Configure Database Properties
Your database needs these exact properties (case-sensitive):

| Property Name | Type | Description |
|--------------|------|-------------|
| **Title** | Title | The news headline (this is the default title field) |
| **Source** | Text | Publication source (e.g., "TechCrunch", "Forbes") |
| **Publication Date** | Date | When the article was published |
| **Source URL** | URL | Link to the original article |
| **Status** | Select | Options: "Published", "Draft" |

### 1.3 Set Up Status Property
1. Click on the "Status" property
2. Add these options:
   - **Published** (Green)
   - **Draft** (Gray)

## Step 2: Create a Notion Integration

### 2.1 Create Integration
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "Create new integration"
3. Fill in the details:
   - **Name**: "FutureFast News Integration" (or your preferred name)
   - **Logo**: Upload your logo (optional)
   - **Associated workspace**: Select your workspace
4. Click "Submit"

### 2.2 Get Integration Token
1. After creating the integration, you'll see the "Internal Integration Token"
2. Copy this token - you'll need it for your environment variables
3. Keep this token secure and never share it publicly

### 2.3 Share Database with Integration
1. Go to your News Articles database in Notion
2. Click the "Share" button (top right)
3. Click "Invite"
4. Search for and select your integration name
5. Give it "Can edit" permissions
6. Click "Invite"

## Step 3: Get Database ID

### 3.1 Find Database ID
1. Open your News Articles database
2. Copy the URL from your browser
3. The database ID is the string of characters between the last `/` and the `?`

**Example URL:**
```
https://www.notion.so/your-workspace/News-Articles-abc123def456?v=xyz789
```
**Database ID:** `abc123def456` (32-character string)

## Step 4: Configure Environment Variables

### 4.1 Update .env.local
Add these lines to your `.env.local` file:

```bash
# Notion Integration (for news articles)
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

Replace:
- `your_notion_integration_token_here` with your integration token from Step 2.2
- `your_notion_database_id_here` with your database ID from Step 3.1

### 4.2 Restart Development Server
```bash
npm run dev
```

## Step 5: Add Sample Data

### 5.1 Create Test Articles
Add a few sample news articles to your Notion database:

| Title | Source | Publication Date | Source URL | Status |
|-------|--------|------------------|------------|--------|
| "AI Breakthroughs Transform 2025" | TechCrunch | 2025-01-15 | https://techcrunch.com/example | Published |
| "Future of Work: Remote AI Teams" | Forbes | 2025-01-10 | https://forbes.com/example | Published |
| "Quantum Computing Milestone" | MIT Review | 2025-01-05 | https://technologyreview.mit.edu/example | Published |

### 5.2 Set Status to Published
Make sure the Status field is set to "Published" for articles you want to display.

## Step 6: Test the Integration

### 6.1 Access Test Page
1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/notion-news-test`
3. You should see your Notion articles displayed

### 6.2 Verify API Endpoint
Test the API directly:
```bash
curl http://localhost:3000/api/notion-news
```

## Troubleshooting

### Common Issues

#### 1. "Notion credentials not configured"
- Check that `NOTION_TOKEN` and `NOTION_DATABASE_ID` are in your `.env.local` file
- Restart your development server after adding environment variables

#### 2. "Failed to fetch news articles from Notion"
- Verify your integration token is correct
- Make sure the database is shared with your integration
- Check that the database ID is correct (32-character string)

#### 3. "No news articles found"
- Ensure you have articles with Status set to "Published"
- Check that property names match exactly (case-sensitive)
- Verify the database structure matches the required properties

#### 4. Property extraction errors
Make sure your Notion database properties are named exactly:
- `Title` (Title field)
- `Source` (Text field)
- `Publication Date` (Date field)
- `Source URL` (URL field)
- `Status` (Select field)

### Debug Mode
Add console logging to see what's happening:

```javascript
// In notion-client.ts, add this after the API call:
console.log('Notion API response:', response);
console.log('Transformed news items:', newsItems);
```

## Advanced Configuration

### Custom Fields
You can add additional fields to your Notion database:
- **Featured** (Checkbox) - Mark articles as featured
- **Category** (Select) - Categorize articles
- **Summary** (Text) - Article summary
- **Image** (Files & Media) - Article image

### Filtering
Modify the API query in `notion-client.ts` to add filters:
```javascript
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

### Custom Sorting
Change the sort order in `notion-client.ts`:
```javascript
sorts: [
  {
    property: 'Publication Date',
    direction: 'descending' // or 'ascending'
  },
  {
    property: 'Title',
    direction: 'ascending'
  }
]
```

## Security Best Practices

1. **Never commit your `.env.local` file** - it contains sensitive tokens
2. **Use environment variables** for all sensitive data
3. **Regularly rotate your integration token** if needed
4. **Limit integration permissions** to only what's necessary
5. **Monitor API usage** through Notion's integration dashboard

## Production Deployment

When deploying to production:

1. **Add environment variables** to your hosting platform (Vercel, Netlify, etc.)
2. **Test the integration** in your production environment
3. **Monitor logs** for any issues
4. **Set up error tracking** to catch integration problems

## Support

If you encounter issues:
1. Check the [Notion API documentation](https://developers.notion.com/)
2. Review the error messages in your browser console
3. Test the integration token with Notion's API directly
4. Verify database permissions and property names

---

**Next Steps:**
- Test your integration with the test page at `/notion-news-test`
- Consider integrating Notion news into your main news feed
- Explore additional Notion features like rich text content and images 