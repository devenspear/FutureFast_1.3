import { NextRequest, NextResponse } from 'next/server';
import NotionYouTubeService from '../../../../lib/notion-youtube-service';

export async function GET() {
  try {
    console.log('📊 Getting YouTube processing stats from Notion...');
    
    const service = new NotionYouTubeService();
    const stats = await service.getProcessingStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Error getting YouTube stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const service = new NotionYouTubeService();

    switch (action) {
      case 'process-all':
        console.log('🚀 Processing all YouTube records from Notion...');
        const stats = await service.processAllYouTubeRecords();
        
        return NextResponse.json({
          success: true,
          message: `Processed ${stats.total} YouTube records. ${stats.successful} successful, ${stats.failed} failed.`,
          data: stats
        });

      case 'get-stats':
        const processingStats = await service.getProcessingStats();
        
        return NextResponse.json({
          success: true,
          data: processingStats
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: process-all, get-stats'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 