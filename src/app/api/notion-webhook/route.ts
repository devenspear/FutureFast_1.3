import { NextRequest, NextResponse } from 'next/server';
import AIContentService from '../../../../lib/ai-content-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 Notion webhook triggered for AI processing...');
    
    const aiContentService = new AIContentService();
    
    // Check if there are incomplete records first
    const stats = await aiContentService.getProcessingStats();
    
    if (stats.incompleteCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No incomplete records found - all up to date!',
        data: { processed: 0, skipped: 0 }
      });
    }
    
    // Process incomplete records
    const processingStats = await aiContentService.processIncompleteRecords();
    
    const message = `Webhook processing complete: ${processingStats.successful} successful, ${processingStats.failed} failed`;
    console.log('✅ ' + message);
    
    return NextResponse.json({
      success: true,
      message,
      data: processingStats
    });
    
  } catch (error) {
    console.error('❌ Webhook AI processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also allow GET for easy testing
export async function GET() {
  return NextResponse.json({
    message: 'Notion AI Processing Webhook is active',
    endpoint: '/api/notion-webhook',
    usage: 'POST to this endpoint to trigger AI content processing'
  });
} 