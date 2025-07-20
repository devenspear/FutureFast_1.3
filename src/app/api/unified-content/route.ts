import { NextRequest, NextResponse } from 'next/server';
import UnifiedContentService from '../../../../lib/unified-content-service';

export async function GET() {
  try {
    console.log('📊 Getting unified content processing stats...');
    
    const service = new UnifiedContentService();
    const stats = await service.getProcessingStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Error getting unified content stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const service = new UnifiedContentService();
    
    switch (action) {
      case 'process-all':
        console.log('🚀 Processing all content (news + YouTube)...');
        const stats = await service.processAllContent();
        
        return NextResponse.json({
          success: true,
          message: `Processed ${stats.total} items: ${stats.newsArticles} news articles, ${stats.youtubeVideos} YouTube videos. ${stats.successful} successful, ${stats.failed} failed.`,
          data: stats
        });

      case 'auto-populate-types':
        console.log('🔄 Auto-populating Content Types...');
        const typeResult = await service.autoPopulateContentTypes();
        
        return NextResponse.json({
          success: true,
          message: `Auto-populated Content Type for ${typeResult.updated} records.`,
          data: typeResult
        });

      case 'get-stats':
        console.log('📊 Getting processing statistics...');
        const processingStats = await service.getProcessingStats();
        
        return NextResponse.json({
          success: true,
          data: processingStats
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Valid actions: process-all, auto-populate-types, get-stats'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Error in unified content processing:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 