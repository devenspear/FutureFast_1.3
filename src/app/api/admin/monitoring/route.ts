import { NextResponse } from 'next/server';
import { adminMonitor } from '../../../../../lib/admin-monitoring-service';

/**
 * Admin Monitoring API
 * Provides operational insights and logs for admin panel
 */
export async function GET(request: Request) {
  try {
    // Simple auth check - could be enhanced
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('operation');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Get logs based on query
    let logs;
    if (operation) {
      logs = adminMonitor.getLogsByOperation(operation as any);
    } else {
      logs = adminMonitor.getRecentLogs(limit);
    }

    // Get error logs
    const errorLogs = adminMonitor.getErrorLogs();

    // Get success rates
    const overallSuccessRate = adminMonitor.getSuccessRate();
    const videoAddSuccessRate = adminMonitor.getSuccessRate('video_add');

    return NextResponse.json({
      logs,
      errorLogs: errorLogs.slice(0, 10), // Last 10 errors
      metrics: {
        overallSuccessRate: overallSuccessRate.toFixed(2) + '%',
        videoAddSuccessRate: videoAddSuccessRate.toFixed(2) + '%',
        totalOperations: logs.length,
        totalErrors: errorLogs.length
      }
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}
