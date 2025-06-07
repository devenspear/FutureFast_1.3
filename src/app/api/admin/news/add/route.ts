import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { generateNewsMetadata } from '@/lib/openai-utils';

// GitHub configuration for automated file creation
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'devenspear/FutureFast_1.3';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Function to create file via GitHub API
async function createFileOnGitHub(fileName: string, content: string, commitMessage: string) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required for automated file creation');
  }

  const filePath = `content/news/${fileName}`;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

  // First, check if file already exists
  try {
    const checkResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (checkResponse.ok) {
      throw new Error('File already exists');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'File already exists') {
      throw error;
    }
    // File doesn't exist, which is what we want
  }

  // Create the file
  const createResponse = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
    }),
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json();
    throw new Error(`GitHub API Error: ${errorData.message || 'Failed to create file'}`);
  }

  return await createResponse.json();
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
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

    // Parse request body
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
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate metadata using AI
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

    // Generate unique filename
    const fileName = `${uuidv4()}.md`;

    // Create file via GitHub API and trigger automatic deployment
    try {
      const commitMessage = `📰 Add news article: ${metadata.title}`;
      await createFileOnGitHub(fileName, markdownContent, commitMessage);
      
      return NextResponse.json({
        success: true,
        message: 'News article created successfully! Your website will automatically redeploy with the new content in 1-2 minutes.',
        metadata,
        fileName,
        autoDeployed: true
      });
    } catch (err) {
      console.error('Error creating file on GitHub:', err);
      
      // If GitHub API fails, return markdown for manual creation
      return NextResponse.json({
        success: true,
        message: 'GitHub API failed - copy the markdown below to manually add the article.',
        metadata: {
          ...metadata,
          markdownContent,
          suggestedFilename: fileName
        },
        requiresManualCreation: true
      });
    }
  } catch (error: unknown) {
    console.error('Error adding news article:', error);
    
    if (error instanceof Error && error.name === 'APIError') {
      return NextResponse.json(
        { error: `AI Error: ${error.message}` },
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
