import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import OpenAI from 'openai';

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is not set');
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  console.log('Initializing OpenAI client with API key:', apiKey.substring(0, 10) + '...');
  return new OpenAI({ apiKey });
}


// Directory to store news articles
const NEWS_DIR = join(process.cwd(), 'content/news');

// Ensure news directory exists
async function ensureNewsDir() {
  if (!existsSync(NEWS_DIR)) {
    await mkdir(NEWS_DIR, { recursive: true });
  }
}



// Generate a slug from a string
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .trim();
}

export async function POST(request: Request) {
  try {
    // Verify authentication by reading the auth-token cookie
    const cookieStore = await cookies(); // Await due to persistent lint error
    console.log('Received cookies in /api/admin/news/submit:', cookieStore.getAll()); // Diagnostic log
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

    const { url, notes } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = getOpenAIClient();
    
    // Generate article content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a tech news writer. Create a summary of the content at this URL: ${url}. 
          The summary should be informative and well-structured.`
        },
        {
          role: "user",
          content: `Please summarize the content at this URL in a few paragraphs.`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || 'No content generated.';
    
    // Generate a shorter summary
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes articles."
        },
        {
          role: "user",
          content: `Please summarize the following article in 1-2 sentences:\n\n${content}`
        }
      ],
      temperature: 0.3,
    });

    const summary = summaryResponse.choices[0]?.message?.content || 'No summary available.';
    const title = `Article from ${new URL(url).hostname}`;
    
    // Create news item
    const newsItem = {
      title,
      source: new URL(url).hostname.replace('www.', ''),
      url,
      publishedDate: new Date().toISOString(),
      featured: false,
      summary,
      notes: notes || '',
    };

    // Ensure news directory exists
    await ensureNewsDir();
    
    // Create markdown content
    const markdownContent = `---
${Object.entries(newsItem)
  .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value.replace(/"/g, '\\"')}"` : value}`)
  .join('\n')}
---

${content}`;

    // Save to file
    const slug = slugify(title);
    const fileName = `${new Date().toISOString().split('T')[0]}-${slug}.md`;
    const filePath = join(NEWS_DIR, fileName);
    
    await writeFile(filePath, markdownContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Article processed successfully',
      filePath,
    });

  } catch (error: unknown) {
    console.error('Error processing news submission:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's an OpenAI API error
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        type: error.type,
        code: error.code
      });
      
      return NextResponse.json(
        { error: `OpenAI API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process article';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
