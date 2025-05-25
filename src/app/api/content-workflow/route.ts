import { NextRequest, NextResponse } from 'next/server';
import { ContentWorkflow } from '../../../../lib/content-workflow';
import { EmailContent } from '../../../../lib/workflow-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📧 Received workflow request:', body);

    // Validate request
    if (!body.content && !body.email) {
      return NextResponse.json(
        { error: 'Missing content or email data' },
        { status: 400 }
      );
    }

    // Initialize workflow with config
    const workflow = new ContentWorkflow({
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: 'gpt-3.5-turbo',
      },
      github: {
        token: process.env.GITHUB_TOKEN || '',
        repo: process.env.GITHUB_REPO || '',
        branch: 'main',
      },
      email: {
        webhookSecret: process.env.EMAIL_WEBHOOK_SECRET || '',
      },
    });

    let result;

    if (body.email) {
      // Process email format
      const emailContent: EmailContent = {
        subject: body.email.subject || 'No Subject',
        body: body.email.body || body.email.content || '',
        sender: body.email.from || body.email.sender || 'unknown',
        receivedAt: new Date(body.email.date || Date.now()),
        urls: body.email.urls || [],
      };

      // If no URLs provided, extract them from body
      if (emailContent.urls.length === 0) {
        const extractedUrls = workflow['extractor'].extractUrlsFromText(emailContent.body);
        emailContent.urls = extractedUrls;
      }

      result = await workflow.processEmail(emailContent);
    } else {
      // Process plain text content
      result = await workflow.processTextContent(
        body.content,
        body.sender || 'api-request'
      );
    }

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Successfully processed ${result.processedCount} items`
        : 'Workflow completed with errors',
      details: {
        processedCount: result.processedCount,
        createdFiles: result.createdFiles,
        errors: result.errors,
        gitCommit: result.gitCommit,
      },
    });

  } catch (error) {
    console.error('Content workflow API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'FutureFast Content Workflow API',
    endpoints: {
      POST: '/api/content-workflow',
    },
    usage: {
      email: 'Send email data with URLs to process',
      content: 'Send plain text with URLs to extract and process',
    },
    example: {
      content: 'Check out this article: https://example.com/ai-breakthrough',
      sender: 'your-email@domain.com'
    },
  });
} 