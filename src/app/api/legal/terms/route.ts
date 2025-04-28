import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function GET() {
  try {
    // Path to the markdown file
    const filePath = path.join(process.cwd(), 'content/legal/terms.md');
    
    // Read the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the front matter
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content);
    
    const contentHtml = processedContent.toString();
    
    // Return the HTML content
    return NextResponse.json({
      title: data.title,
      lastUpdated: data.lastUpdated,
      content: contentHtml
    });
  } catch (error) {
    console.error('Error loading terms:', error);
    return NextResponse.json(
      { error: 'Failed to load Terms of Service' },
      { status: 500 }
    );
  }
}
