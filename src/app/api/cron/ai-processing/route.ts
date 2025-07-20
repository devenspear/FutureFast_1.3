import { NextRequest, NextResponse } from 'next/server';
import UnifiedContentService from '../../../../../lib/unified-content-service';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🤖 Starting scheduled unified content processing...');
    
    const unifiedService = new UnifiedContentService();
    const stats = await unifiedService.processAllContent();
    
    const message = `Scheduled processing complete: ${stats.successful} successful, ${stats.failed} failed out of ${stats.total} total records`;
    
    console.log('✅ ' + message);
    
    return NextResponse.json({
      success: true,
      message,
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Scheduled AI processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Allow manual triggering via POST as well
export async function POST(request: NextRequest) {
  return GET(request);
} 