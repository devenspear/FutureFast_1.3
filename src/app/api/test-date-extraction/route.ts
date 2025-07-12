import { NextRequest, NextResponse } from 'next/server';
import { generateNewsMetadata } from '../../../../lib/openai-utils';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing enhanced date extraction for: ${url}`);
    
    const metadata = await generateNewsMetadata(url);
    
    return NextResponse.json({
      success: true,
      url,
      metadata,
      message: 'Date extraction test completed'
    });
    
  } catch (error) {
    console.error('❌ Test date extraction failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Date extraction test failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Date Extraction Test Endpoint',
    usage: 'POST with { "url": "https://example.com/article" }',
    features: [
      'Meta tag date extraction',
      'JSON-LD structured data parsing',
      'AI-powered content analysis',
      'Multiple date format support',
      'Fallback date handling'
    ]
  });
} 