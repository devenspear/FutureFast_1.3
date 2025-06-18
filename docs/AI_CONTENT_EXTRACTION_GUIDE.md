# AI Content Extraction System

## 🤖 Overview

The AI Content Extraction System automatically populates missing fields in your Notion news database by analyzing webpage content from URLs. When you add a news article URL to Notion but leave the title, source, or publication date empty, this system uses OpenAI to extract that information for you.

## ✨ Features

- **🔍 Intelligent Web Scraping**: Fetches webpage content with browser-like headers
- **🧠 AI-Powered Analysis**: Uses OpenAI GPT-4o-mini to extract precise metadata  
- **📊 Batch Processing**: Process all incomplete records at once
- **🔄 Smart Updates**: Only updates empty fields, preserves existing data
- **⚡ Fast & Efficient**: 1-second delays between requests for respectful scraping
- **🛡️ Error Handling**: Robust fallback mechanisms and detailed error reporting

## 🏗️ Architecture

### Core Components

1. **ContentExtractor** (`lib/content-extractor.ts`)
   - Fetches webpage content
   - Extracts meta tags and HTML content
   - Uses OpenAI to analyze and extract structured data

2. **NotionClient** (`lib/notion-client.ts`)
   - Extended with update capabilities
   - Queries incomplete records
   - Updates records with extracted content

3. **AIContentService** (`lib/ai-content-service.ts`)
   - Orchestrates the extraction process
   - Handles batch processing
   - Provides processing statistics

4. **API Endpoint** (`src/app/api/ai-content-extraction/route.ts`)
   - HTTP interface for triggering extraction
   - Supports batch and single URL processing

5. **Test Interface** (`src/app/ai-content-test/page.tsx`)
   - Interactive testing and monitoring dashboard

## 📋 Prerequisites

### Required Environment Variables

The system uses existing OpenAI configuration. Ensure these are in your `.env.local` file:

```env
# OpenAI API (already used in the project for content generation)
OPENAI_API_KEY=your_openai_api_key_here

# Notion Integration
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### OpenAI API Key Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file
4. Ensure you have credits/billing set up

### Notion Database Schema

Your Notion database must have these properties:
- **Title** (Title type)
- **Source** (Rich Text type)  
- **Publication Date** (Date type)
- **Source URL** (URL type)
- **Status** (Select type with "Published" option)

## 🚀 Usage

### 1. Automatic Processing (Recommended)

The system automatically identifies records that need content extraction:
- Records with a `Source URL` but missing `Title`, `Source`, or `Publication Date`

### 2. API Endpoints

#### Get System Status
```bash
GET /api/ai-content-extraction
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "active",
    "incompleteRecords": 5,
    "totalRecords": 25,
    "readyForProcessing": true
  }
}
```

#### Process All Incomplete Records
```bash
POST /api/ai-content-extraction
Content-Type: application/json

{
  "action": "process-all"
}
```

#### Process Single URL
```bash
POST /api/ai-content-extraction
Content-Type: application/json

{
  "action": "process-url",
  "url": "https://techcrunch.com/2024/01/15/ai-breakthrough"
}
```

### 3. Test Interface

Visit `http://localhost:3000/ai-content-test` to:
- View system status and statistics
- Test single URL extraction
- Process all incomplete records
- Monitor extraction results

## 🔧 How It Works

### 1. Content Fetching
```typescript
// Fetches webpage with realistic browser headers
const response = await fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0...',
    'Accept': 'text/html,application/xhtml+xml...',
    // ... more headers
  }
});
```

### 2. AI Analysis
The system sends webpage content to OpenAI with this prompt:

```
Analyze this webpage content and extract:
1. EXACT TITLE: The precise, complete title as published
2. NEWS SOURCE: The publication name (e.g., "TechCrunch", "Forbes")
3. PUBLISHED DATE: The exact publication date in YYYY-MM-DD format

Response must be valid JSON:
{
  "title": "exact article title here",
  "source": "publication name here", 
  "publishedDate": "YYYY-MM-DD"
}
```

### 3. Smart Updates
- Only updates empty fields in Notion
- Preserves existing data
- Validates extracted data before updating

### 4. Fallback Mechanisms
If AI extraction fails, the system attempts:
- Meta tag extraction (og:title, article:published_time, etc.)
- Domain-based source extraction
- Current date as fallback for missing dates

## 📊 Performance & Costs

### Processing Speed
- **Single URL**: ~3-5 seconds
- **Batch Processing**: ~5 seconds per URL (includes 1s delay)

### OpenAI API Costs
- **Model**: GPT-4o (existing project standard)
- **Tokens per request**: ~500-1000 tokens
- **Estimated cost**: ~$0.005-$0.01 per URL

### Rate Limiting
- 1-second delay between requests
- Respectful to target websites
- Can be adjusted in `AIContentService.delay()`

## 🛠️ Customization

### Adjusting AI Prompts
Edit the prompt in `ContentExtractor.extractWithAI()`:

```typescript
const prompt = `
Your custom extraction instructions here...
`;
```

### Modifying Delays
Change processing delays in `AIContentService`:

```typescript
await this.delay(2000); // 2 seconds instead of 1
```

### Adding New Fields
Extend the extraction to include new fields:

1. Update interfaces in `content-extractor.ts`
2. Modify the AI prompt
3. Update Notion update logic
4. Extend the API responses

## 🔍 Monitoring & Debugging

### Console Logging
The system provides detailed console logging:
- 🔍 Starting extraction
- ✅ Successful extractions  
- ❌ Failed extractions
- 📊 Processing statistics

### Error Handling
Common errors and solutions:

1. **OpenAI API Error**: Check API key and credits
2. **Notion API Error**: Verify token and database permissions
3. **Web Scraping Error**: Some sites block automated requests
4. **Parse Error**: AI response not in expected JSON format

### Test URLs
Good test URLs for different news sources:
- TechCrunch: `https://techcrunch.com/...`
- Forbes: `https://www.forbes.com/...`
- Reuters: `https://www.reuters.com/...`
- BBC: `https://www.bbc.com/news/...`

## 🚦 Best Practices

### 1. Data Quality
- Review AI-extracted content before publishing
- Use the test interface to verify accuracy
- Set up manual review workflows for critical content

### 2. Rate Limiting
- Don't process too many URLs simultaneously
- Respect website terms of service
- Consider implementing additional delays for heavy usage

### 3. Cost Management
- Monitor OpenAI API usage
- Set up billing alerts
- Consider caching results for repeated URLs

### 4. Error Monitoring
- Check console logs regularly
- Set up alerts for high failure rates
- Monitor processing statistics

## 🔐 Security Considerations

### 1. API Key Protection
- Never commit API keys to version control
- Use environment variables only
- Consider using secret management services

### 2. Input Validation
- Validate URLs before processing
- Sanitize extracted content
- Implement rate limiting on API endpoints

### 3. Notion Permissions
- Use minimal required permissions
- Regularly review integration access
- Monitor database access logs

## 🎯 Roadmap

### Upcoming Features
- [ ] Automated scheduling for batch processing
- [ ] Support for more content types (PDFs, etc.)
- [ ] Advanced caching mechanisms
- [ ] Integration with webhooks for real-time processing
- [ ] Enhanced error recovery and retry logic
- [ ] Support for custom extraction rules per domain

### Performance Improvements
- [ ] Parallel processing with queue management
- [ ] Smarter fallback strategies
- [ ] Content-type specific extractors
- [ ] Machine learning model training on successful extractions

## 💡 Tips & Tricks

### 1. Bulk URL Addition
To add multiple URLs quickly:
1. Paste URLs into Notion Source URL field
2. Leave other fields empty
3. Run batch processing
4. Review and publish

### 2. Quality Control
- Use the test interface to verify extraction quality
- Manually review AI-generated titles for accuracy
- Check publication dates for reasonableness

### 3. Troubleshooting
- Check browser network tab for API errors
- Use the test interface to debug single URLs
- Monitor console logs for detailed error information

## 📞 Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Test with the `/ai-content-test` interface
3. Verify all environment variables are set correctly
4. Ensure OpenAI API credits are available

This AI Content Extraction System transforms your Notion news management workflow from manual data entry to intelligent automation! 🚀 