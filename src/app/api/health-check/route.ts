import { NextRequest, NextResponse } from 'next/server';
import HealthMonitor from '../../../../lib/health-monitor';

export async function GET(_request: NextRequest) {
  try {
    console.log('🏥 Running system health check...');
    
    const healthMonitor = new HealthMonitor();
    const healthStatus = await healthMonitor.checkSystemHealth();
    
    const statusCode = healthStatus.isHealthy ? 200 : 500;
    
    console.log(`🏥 Health check completed: ${healthStatus.isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    
    return NextResponse.json({
      status: healthStatus.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      ...healthStatus
    }, { status: statusCode });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sendHealthyUpdate } = await request.json();
    
    console.log('🏥 Running system health check...');
    
    const healthMonitor = new HealthMonitor();
    const healthStatus = await healthMonitor.checkSystemHealth();
    
    // Optionally send a "healthy" notification if requested
    if (sendHealthyUpdate && healthStatus.isHealthy) {
      await healthMonitor.sendHealthyStatusUpdate(healthStatus);
    }
    
    const statusCode = healthStatus.isHealthy ? 200 : 500;
    
    return NextResponse.json({
      status: healthStatus.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      notificationSent: sendHealthyUpdate && healthStatus.isHealthy,
      ...healthStatus
    }, { status: statusCode });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}