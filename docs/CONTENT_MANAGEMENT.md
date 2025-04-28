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
footer_text: 2025 Deven Spear | All Rights Reserved
---
```

### Hero Section (`/content/sections/hero.md`)

Controls the main headline and subheadline on the homepage.

```markdown
---
headline: Win the Race of Exponential Disruption
subheadline: Executive-level insights on AI, Web3, Robotics & beyond
---
```

### About Section (`/content/sections/about.md`)

Controls the headline and subheadline in the About FutureFast section.

```markdown
---
headline: About FutureFast
subheadline: Our mission is to empower leaders with clarity in a world of exponential change.
---
```

### About Me (`/content/sections/about_me.md`)

Controls the content in the About Deven section.

```markdown
---
title: About Deven
headline: About Deven
image: /DKS_Future_head.JPG
bio_paragraphs:
  - "Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity."
  - "Second paragraph about Deven goes here."
---
```

### Why We Exist (`/content/sections/why_we_exist.md`)

Controls the content in the Why We Exist section.

```markdown
---
headline: Why We Exist
subheadline: Our purpose statement
problem_statement: The problem we're solving
solution_statement: How we solve it
how_different:
  - "First differentiator"
  - "Second differentiator"
  - "Third differentiator"
---
```

### Scrolling Quotes (`/content/quotes/scrolling_quotes.md`)

Controls the quotes that scroll across the screen.

```markdown
---
# You can use either simple quotes or quotes with attribution
quotes:
  - "The best way to predict the future is to create it."
  - "Innovation distinguishes between a leader and a follower."

# Preferred format with attribution
quotes_with_attribution:
  - text: "The best way to predict the future is to create it."
    author: "Alan Kay"
  - text: "Innovation distinguishes between a leader and a follower."
    author: "Steve Jobs"
---
```

### Thought Leaders (`/content/thought-leaders/thought-leaders.md`)

Controls the thought leaders displayed in the Thought Leaders section.

```markdown
---
leaders:
  - name: "Jane Doe"
    title: "AI Researcher"
    company: "Tech Innovations"
    image: "/images/jane-doe.jpg"
  - name: "John Smith"
    title: "Blockchain Expert"
    company: "Future Finance"
    image: "/images/john-smith.jpg"
---
```

### News Items (`/content/news/*.md`)

Each file in this directory represents a news item. The filename doesn't matter as long as it ends with `.md`.

```markdown
---
title: "Major AI Breakthrough Announced"
source: "Tech News Daily"
url: "https://example.com/news/ai-breakthrough"
publishedDate: "2025-04-15"
featured: true
---

Optional content about the news item can go here.
```

### Catalog Items (`/content/catalog/*.md`)

Each file in this directory represents a catalog/library item. The filename doesn't matter as long as it ends with `.md`.

```markdown
---
title: "The Future of Work"
description: "How AI will transform jobs in the next decade"
year: 2025
month: "April"
type: "Report"
tag: "AI"
image: "/images/future-work.jpg"
url: "https://example.com/reports/future-work"
---

Full content of the report can go here in Markdown format.
```

## CloudCannon Integration

This content structure is fully compatible with CloudCannon CMS. When connected to CloudCannon:

1. Each Markdown file will be editable through CloudCannon's visual editor
2. The frontmatter will be presented as form fields
3. Arrays (like `bio_paragraphs` or `quotes`) will be presented as repeatable items
4. Images can be uploaded directly through CloudCannon's interface

To set up CloudCannon:

1. Connect your GitHub repository to CloudCannon
2. Configure the content collections to match the structure in `/content`
3. Define schemas for each content type based on the examples above
4. Invite editors to your CloudCannon project

## Best Practices

1. Always preview changes before publishing to production
2. Use descriptive filenames for new content items
3. Keep frontmatter properties consistent with the examples
4. When adding new content types, update this documentation
5. Images should be optimized before uploading

## Troubleshooting

If content changes aren't appearing on the site:

1. Make sure the file is saved with the correct format and extension
2. Verify that all required frontmatter properties are present
3. Check that the file is in the correct directory
4. Ensure the changes have been committed and pushed to GitHub
5. Wait a few minutes for the Vercel deployment to complete
