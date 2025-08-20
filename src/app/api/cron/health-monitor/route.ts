import { NextRequest, NextResponse } from 'next/server';
import HealthMonitor from '../../../../../lib/health-monitor';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    // Check for Vercel's cron authentication
    const vercelCronAuth = request.headers.get('x-vercel-cron-signature');
    
    const isVercelCron = vercelCronAuth !== null;
    const isLocalCron = authHeader === `Bearer ${cronSecret}`;
    
    if (!isVercelCron && !isLocalCron) {
      console.log('❌ Unauthorized health monitor request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🏥 Starting scheduled health check...');
    
    const healthMonitor = new HealthMonitor();
    const healthStatus = await healthMonitor.checkSystemHealth();
    
    const message = healthStatus.isHealthy 
      ? `Health check passed: System is healthy (${healthStatus.successfulArticles}/${healthStatus.totalArticles} articles processed successfully)`
      : `Health check failed: ${healthStatus.issues.length} issues detected`;
    
    console.log(healthStatus.isHealthy ? '✅ ' + message : '❌ ' + message);
    
    return NextResponse.json({
      success: healthStatus.isHealthy,
      message,
      healthStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Scheduled health check failed:', error);
    
    // Send critical error notification
    try {
      const healthMonitor = new HealthMonitor();
      await healthMonitor['notificationService'].sendCriticalError(
        'Health monitoring system failure', 
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    } catch (notificationError) {
      console.error('❌ Failed to send health check error notification:', notificationError);
    }
    
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