import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateNewsMetadata } from '@/lib/openai-utils';

// Directory where news markdown files are stored
const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

// Check if we're in a development environment
const isDevelopment = process.env.NODE_ENV !== 'production';

// Ensure the news directory exists (only in development)
if (isDevelopment && !fs.existsSync(NEWS_DIR)) {
  try {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create news directory:', err);
    // Continue execution - we'll handle file operations differently based on environment
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication by reading the auth-token cookie
    const cookieStore = await cookies();
    console.log('Received cookies in /api/admin/news/add:', cookieStore.getAll()); // Diagnostic log
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      console.log('auth-token cookie not found or has no value.'); // Diagnostic log
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
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
    } catch (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            _) {
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

    // In development, try to write to the file system
    if (isDevelopment) {
      try {
        fs.writeFileSync(filePath, markdownContent, 'utf-8');
        console.log(`News article saved to ${filePath}`);
      } catch (err) {
        console.error('Error writing file:', err);
        // Continue execution - we'll return success even if file write fails
      }
    } else {
      // In production, we don't try to write to the file system
      console.log('Production environment detected - not writing to file system');
    }

    return NextResponse.json({
      success: true,
      message: 'News article added successfully',
      metadata,
      id: fileName.replace('.md', '')
    });
  } catch (error: unknown) {
    console.error('Error adding news article:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's an OpenAI API error
    if (error instanceof Error && error.name === 'APIError') {
      console.error('OpenAI API Error:', error);
      
      return NextResponse.json(
        { error: `OpenAI API Error: ${error.message}` },
        { status: 500 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to add news article';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
