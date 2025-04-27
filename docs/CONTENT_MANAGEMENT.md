# Content Management System

This document explains how to edit the static text content of the FutureFast website using Markdown files.

## Overview

The FutureFast website is designed with a content-first approach, allowing you to edit all static text through Markdown files without touching the code. This makes it easy to update content without developer assistance.

All content is stored in the `/content` directory, organized by section type:

```
/content
  /catalog         # Resource cards in the library grid
  /news            # News items
  /quotes          # Scrolling quotes
  /sections        # Main website sections (hero, about, etc.)
  /site            # Global site settings
  /thought-leaders # Thought leader profiles
```

## How to Edit Content

### Basic Workflow

1. Navigate to the appropriate content file in the `/content` directory
2. Edit the file using Markdown syntax
3. Save the file
4. Commit and push your changes to GitHub
5. Vercel will automatically deploy the updated content

### Markdown Format

Each content file follows a standard format with frontmatter (metadata) at the top, enclosed in triple dashes (`---`):

```markdown
---
title: Example Title
description: This is an example description
---

Optional body content here.
```

The frontmatter contains key-value pairs that define the content properties. Different section types have different required properties.

## Content Sections

### Site Settings (`/content/site/settings.md`)

Controls global site settings like the site title and footer text.

```markdown
---
site_title: FutureFast
footer_text: 2025 Deven Spear | All Rights Reserved | IIVVCMIV
---
```

### Hero Section (`/content/sections/hero.md`)

Controls the main headline and subheadline on the homepage.

```markdown
---
headline: Win the Race of Exponential Disruption
subheadline: Executive-level insights on AI, Web3, Robotics & beyond—delivered in minutes, not years
---
```

### About Section (`/content/sections/about.md`)

Controls the "About FutureFast" section content.

```markdown
---
headline: "About FutureFast"
subheadline: "Our mission is to empower leaders with clarity in a world of exponential change."
---
```

### About Me Section (`/content/sections/about_me.md`)

Controls the "About Deven" section content.

```markdown
---
title: About Deven
headline: About Deven
image: /DKS_Future_head.JPG
bio_paragraphs:
  - "Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity. With deep expertise across real estate development, emerging tech (AI, Blockchain, Web3), and wellness innovation, he builds ventures that bridge physical and digital worlds."
---
```

### Why We Exist Section (`/content/sections/why_we_exist.md`)

Controls the "Why We Exist" section content.

```markdown
---
headline: Why We Exist
subheadline: Navigating exponential change requires exponential clarity.
problem_statement: "Most executives are drowning in information but starving for insight. The signal-to-noise ratio is worse than ever."
solution_statement: "FutureFast curates only the highest-quality sources, distills complex topics into executive summaries, and delivers them in a mobile-first experience."
how_different:
  - title: "Executive First"
    description: "Written for decision‑makers, not developers."
  - title: "Neutral Librarian"
    description: "We curate all credible voices—McKinsey, CB Insights, podcasts, whitepapers—so you don't have to."
---
```

### Scrolling Quotes (`/content/quotes/scrolling_quotes.md`)

Controls the quotes that scroll in the quotation ribbon.

```markdown
---
quotes:
  - text: "The best way to predict the future is to create it."
    author: "Alan Kay"
  - text: "Innovation distinguishes between a leader and a follower."
    author: "Steve Jobs"
---
```

### News Items (`/content/news/*.md`)

Each file in this directory represents a news item. Use the `_template.md` file as a starting point.

```markdown
---
title: "AI Breakthroughs in 2025: What Business Leaders Need to Know"
source: "TechCrunch"
url: "https://techcrunch.com/ai-breakthroughs-2025"
publishedDate: "2025-01-15T09:30:00.000Z"
featured: true
---
```

### Catalog Items (`/content/catalog/*.md`)

Each file in this directory represents a resource card in the library grid. Use the `_template.md` file as a starting point.

```markdown
---
title: CB Insights Tech Trends 2025
description: "Fifteen inflection points—agentic AI, quantum-safe encryption, ambient robotics, bio-foundries—mapped via funding, patent, and hiring signals."
year: 2025
month: December
type: Report
tag: Tech
image: /uploads/cb-insights-tech-trends-2025.jpg
url: https://example.com/report.pdf
---
```

### Thought Leaders (`/content/thought-leaders/thought-leaders.md`)

Controls the thought leaders section.

```markdown
---
leaders:
  - name: "Robert Breedlove"
    expertise: "Bitcoin, Monetary Theory"
    socialLinks:
      - emoji: "🐦"
        label: "Breedlove22"
        url: "https://x.com/Breedlove22"
      - emoji: "📺"
        label: "What is Money? YouTube"
        url: "https://www.youtube.com/@Robert_Breedlove"
---
```

## CloudCannon Integration

All content files are accessible and editable through CloudCannon's content management interface. CloudCannon provides a user-friendly way to edit the Markdown files without having to use Git directly.

To access the CloudCannon editor:

1. Log in to your CloudCannon account
2. Select the FutureFast project
3. Navigate to the "Content" section
4. Choose the file you want to edit
5. Make your changes in the visual editor
6. Save your changes

CloudCannon will automatically commit and push your changes to GitHub, triggering a new deployment on Vercel.

## Best Practices

1. **Use Templates**: When creating new content files, start with the appropriate `_template.md` file
2. **Maintain Formatting**: Keep the frontmatter structure consistent
3. **Optimize Images**: Compress images before uploading to keep the site fast
4. **Preview Changes**: Use the CloudCannon preview feature to see how your changes will look before publishing
5. **Validate Links**: Ensure all URLs are correct and working before saving

## Troubleshooting

If your content changes aren't appearing on the site:

1. Check that you saved the file
2. Verify that the frontmatter format is correct (proper indentation, no missing colons)
3. Ensure the file is in the correct location
4. Check if there are any build errors in the Vercel deployment logs
5. Clear your browser cache to ensure you're seeing the latest version

For more complex issues, consult the development team.
