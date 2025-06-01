import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticated } from '@/lib/auth-utils';
import { generateNewsMetadata } from '@/lib/openai-utils';

// Directory where news markdown files are stored
const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

// Ensure the news directory exists
if (!fs.existsSync(NEWS_DIR)) {
  fs.mkdirSync(NEWS_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { url, featured = false } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (_) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check if the URL already exists in any news file
    const existingFiles = fs.readdirSync(NEWS_DIR).filter(file => file.endsWith('.md'));
    
    for (const file of existingFiles) {
      const filePath = path.join(NEWS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      if (content.includes(url)) {
        return NextResponse.json(
          { error: 'This news article URL already exists' },
          { status: 409 }
        );
      }
    }

    // Generate metadata using OpenAI
    const metadata = await generateNewsMetadata(url);

    // Create markdown content with YAML frontmatter
    const markdownContent = `---
title: "${metadata.title.replace(/"/g, '\\"')}"
url: "${url}"
source: "${metadata.source.replace(/"/g, '\\"')}"
publishedDate: "${metadata.publishedDate}"
featured: ${featured}
summary: "${metadata.summary.replace(/"/g, '\\"')}"
tags: [${metadata.tags.map((tag: string) => `"${tag.replace(/"/g, '\"')}"`).join(', ')}]
---

${metadata.summary}

[Read the full article](${url})
`;

    // Generate a unique filename using UUID
    const fileName = `${uuidv4()}.md`;
    const filePath = path.join(NEWS_DIR, fileName);

    // Write the markdown file
    fs.writeFileSync(filePath, markdownContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'News article added successfully',
      metadata
    });
  } catch (error) {
    console.error('Error adding news article:', error);
    return NextResponse.json(
      { error: 'Failed to add news article' },
      { status: 500 }
    );
  }
}
