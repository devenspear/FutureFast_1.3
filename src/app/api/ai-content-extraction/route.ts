import { NextRequest, NextResponse } from 'next/server';
import AIContentService from '../../../../lib/ai-content-service';

export async function POST(request: NextRequest) {
  try {
    const { action, url } = await request.json();
    const aiContentService = new AIContentService();

    switch (action) {
      case 'process-all':
        // Process all incomplete records
        console.log('🚀 Processing all incomplete records...');
        const stats = await aiContentService.processIncompleteRecords();
        
        return NextResponse.json({
          success: true,
          message: `Processed ${stats.total} records. ${stats.successful} successful, ${stats.failed} failed.`,
          data: stats
        });

      case 'process-url':
        // Process a single URL
        if (!url) {
          return NextResponse.json({
            success: false,
            error: 'URL is required for process-url action'
          }, { status: 400 });
        }

        console.log(`🔍 Processing single URL: ${url}`);
        const result = await aiContentService.processRecordByUrl(url);
        
        return NextResponse.json({
          success: result.success,
          message: result.success 
            ? `Successfully extracted content from ${url}` 
            : `Failed to extract content: ${result.error}`,
          data: result
        });

      case 'get-stats':
        // Get processing statistics
        const processingStats = await aiContentService.getProcessingStats();
        
        return NextResponse.json({
          success: true,
          data: processingStats
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: process-all, process-url, get-stats'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ AI Content Extraction API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const aiContentService = new AIContentService();
    const stats = await aiContentService.getProcessingStats();
    
    return NextResponse.json({
      success: true,
      message: 'AI Content Extraction Service Status',
      data: {
        status: 'active',
        incompleteRecords: stats.incompleteCount,
        totalRecords: stats.totalCount,
        readyForProcessing: stats.incompleteCount > 0
      }
    });
    
  } catch (error) {
    console.error('❌ AI Content Extraction Status Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 