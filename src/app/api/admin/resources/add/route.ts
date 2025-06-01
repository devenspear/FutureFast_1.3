import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticated } from '@/lib/auth-utils';
import { generateResourceMetadata } from '@/lib/openai-utils';

// Directory where catalog/resource markdown files are stored
const CATALOG_DIR = path.join(process.cwd(), 'content', 'catalog');

// Ensure the catalog directory exists
if (!fs.existsSync(CATALOG_DIR)) {
  fs.mkdirSync(CATALOG_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { url, type = 'Report' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            _) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check if the URL already exists in any catalog file
    const existingFiles = fs.readdirSync(CATALOG_DIR).filter(file => file.endsWith('.md'));
    
    for (const file of existingFiles) {
      const filePath = path.join(CATALOG_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      if (content.includes(url)) {
        return NextResponse.json(
          { error: 'This resource URL already exists' },
          { status: 409 }
        );
      }
    }

    // Generate metadata using OpenAI
    const metadata = await generateResourceMetadata(url, type);

    // Create a tag from the first tag in the array
    const primaryTag = metadata.tags[0] || type.toLowerCase();

    // Create markdown content with YAML frontmatter
    const markdownContent = `---
title: "${metadata.title.replace(/"/g, '\\"')}"
url: "${url}"
type: "${type}"
month: "${metadata.month}"
year: "${metadata.year}"
description: "${metadata.description.replace(/"/g, '\\"')}"
tag: "${primaryTag}"
---

${metadata.description}

[Download Resource](${url})
`;

    // Generate a unique filename using UUID
    const fileName = `${uuidv4()}.md`;
    const filePath = path.join(CATALOG_DIR, fileName);

    // Write the markdown file
    fs.writeFileSync(filePath, markdownContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Resource added successfully',
      metadata
    });
  } catch (error) {
    console.error('Error adding resource:', error);
    return NextResponse.json(
      { error: 'Failed to add resource' },
      { status: 500 }
    );
  }
}
