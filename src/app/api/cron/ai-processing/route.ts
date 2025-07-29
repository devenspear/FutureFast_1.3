import { NextRequest, NextResponse } from 'next/server';
import UnifiedContentService from '../../../../../lib/unified-content-service';
import NotificationService from '../../../../../lib/notification-service';

export async function GET(request: NextRequest) {
  const notificationService = new NotificationService();
  
  try {
    // Log incoming headers for debugging
    console.log('🔍 Cron request headers:', Object.fromEntries(request.headers.entries()));
    
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    // Check for Vercel's cron authentication (they use a different header)
    const vercelCronAuth = request.headers.get('x-vercel-cron-signature');
    
    // In production on Vercel, cron jobs are authenticated differently
    const isVercelCron = vercelCronAuth !== null;
    const isLocalCron = authHeader === `Bearer ${cronSecret}`;
    
    if (!isVercelCron && !isLocalCron) {
      console.log('❌ Unauthorized cron request:', { authHeader, vercelCronAuth });
      
      // Send critical error notification for unauthorized access
      await notificationService.sendCriticalError('Unauthorized cron request detected', {
        authHeader,
        vercelCronAuth,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent')
      });
      
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🤖 Starting scheduled unified content processing...');
    console.log('✅ Authentication passed:', { isVercelCron, isLocalCron });
    
    const unifiedService = new UnifiedContentService();
    const stats = await unifiedService.processAllContent();
    
    const message = `Scheduled processing complete: ${stats.successful} successful, ${stats.failed} failed out of ${stats.total} total records`;
    
    console.log('✅ ' + message);
    
    // Send summary notification
    await notificationService.sendProcessingSummary(stats);
    
    return NextResponse.json({
      success: true,
      message,
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Scheduled AI processing failed:', error);
    
    // Send critical error notification
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await notificationService.sendCriticalError(errorMessage, {
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Allow manual triggering via POST as well
export async function POST(request: NextRequest) {
  return GET(request);
} 