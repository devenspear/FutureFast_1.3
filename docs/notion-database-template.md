# Notion Database Template - News Articles

## Database Structure

Copy this template to create your Notion database:

### Properties Configuration

| Property Name | Property Type | Configuration |
|--------------|---------------|---------------|
| **Title** | Title | (Default - no configuration needed) |
| **Source** | Text | (Empty text field) |
| **Publication Date** | Date | (Date only, no time) |
| **Source URL** | URL | (URL field) |
| **Status** | Select | Options: "Published" (Green), "Draft" (Gray) |

### Sample Data

Here's sample data to test your integration:

| Title | Source | Publication Date | Source URL | Status |
|-------|--------|------------------|------------|--------|
| OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities | TechCrunch | 2025-01-15 | https://techcrunch.com/openai-gpt5-announcement | Published |
| Meta's AI Revolution: How Virtual Reality is Changing Work | Forbes | 2025-01-12 | https://forbes.com/meta-ai-vr-work-transformation | Published |
| Quantum Computing Milestone: IBM Achieves Error-Free Calculations | MIT Technology Review | 2025-01-10 | https://technologyreview.mit.edu/ibm-quantum-milestone | Published |
| The Future of Autonomous Vehicles: Tesla's New Neural Network | Wired | 2025-01-08 | https://wired.com/tesla-autonomous-neural-network | Published |
| Apple's Vision Pro 2: Augmented Reality Goes Mainstream | The Verge | 2025-01-05 | https://theverge.com/apple-vision-pro-2-ar-mainstream | Draft |

## Quick Setup Checklist

- [ ] Create new Notion database
- [ ] Add all 5 properties with correct types
- [ ] Configure Status select options (Published, Draft)
- [ ] Add sample data from the table above
- [ ] Create Notion integration
- [ ] Share database with integration
- [ ] Copy database ID from URL
- [ ] Add environment variables to .env.local
- [ ] Test with `/notion-news-test` page

## Copy-Paste Template

You can copy and paste this structure directly into Notion:

```
News Articles Database

Properties:
- Title (Title)
- Source (Text)  
- Publication Date (Date)
- Source URL (URL)
- Status (Select: Published, Draft)

Sample Article 1:
Title: OpenAI Announces GPT-5 with Breakthrough Reasoning Capabilities
Source: TechCrunch
Publication Date: January 15, 2025
Source URL: https://techcrunch.com/openai-gpt5-announcement
Status: Published

Sample Article 2:
Title: Meta's AI Revolution: How Virtual Reality is Changing Work  
Source: Forbes
Publication Date: January 12, 2025
Source URL: https://forbes.com/meta-ai-vr-work-transformation
Status: Published

Sample Article 3:
Title: Quantum Computing Milestone: IBM Achieves Error-Free Calculations
Source: MIT Technology Review
Publication Date: January 10, 2025
Source URL: https://technologyreview.mit.edu/ibm-quantum-milestone
Status: Published
```

## Visual Database Layout

Your Notion database should look like this:

```
┌─────────────────────────────────────────────┬─────────────────┬───────────────────┬─────────────────────────────────────────┬───────────┐
│ Title                                       │ Source          │ Publication Date  │ Source URL                              │ Status    │
├─────────────────────────────────────────────┼─────────────────┼───────────────────┼─────────────────────────────────────────┼───────────┤
│ OpenAI Announces GPT-5 with Breakthrough...│ TechCrunch      │ Jan 15, 2025      │ https://techcrunch.com/openai-gpt5...   │ Published │
│ Meta's AI Revolution: How Virtual Reality...│ Forbes          │ Jan 12, 2025      │ https://forbes.com/meta-ai-vr-work...   │ Published │
│ Quantum Computing Milestone: IBM Achieves..│ MIT Tech Review │ Jan 10, 2025      │ https://technologyreview.mit.edu/ibm... │ Published │
│ The Future of Autonomous Vehicles: Tesla's.│ Wired           │ Jan 8, 2025       │ https://wired.com/tesla-autonomous...   │ Published │
│ Apple's Vision Pro 2: Augmented Reality... │ The Verge       │ Jan 5, 2025       │ https://theverge.com/apple-vision...    │ Draft     │
└─────────────────────────────────────────────┴─────────────────┴───────────────────┴─────────────────────────────────────────┴───────────┘
```

## Next Steps

1. **Create your database** using this template
2. **Follow the setup guide** in `notion-integration-setup.md`
3. **Test the integration** at `http://localhost:3000/notion-news-test`
4. **Add real news articles** to your database
5. **Integrate into your main site** as needed 