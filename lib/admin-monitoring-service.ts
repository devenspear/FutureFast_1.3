/**
 * Admin Monitoring Service
 * Tracks and logs admin operations for debugging and analytics
 */

interface AdminOperationLog {
  timestamp: string;
  operation: 'video_add' | 'video_update' | 'video_delete' | 'news_add' | 'resource_add';
  status: 'success' | 'error' | 'pending';
  user?: string;
  metadata?: Record<string, any>;
  error?: string;
  duration?: number;
}

class AdminMonitoringService {
  private logs: AdminOperationLog[] = [];
  private maxLogs = 100; // Keep last 100 operations in memory

  /**
   * Log an admin operation
   */
  log(log: Omit<AdminOperationLog, 'timestamp'>): void {
    const entry: AdminOperationLog = {
      ...log,
      timestamp: new Date().toISOString()
    };

    // Add to in-memory logs
    this.logs.unshift(entry);

    // Trim to max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console log for immediate debugging
    const emoji = log.status === 'success' ? '✅' : log.status === 'error' ? '❌' : '⏳';
    console.log(`${emoji} [AdminMonitor] ${log.operation}:`, {
      status: log.status,
      user: log.user,
      duration: log.duration ? `${log.duration}ms` : undefined,
      metadata: log.metadata,
      error: log.error
    });

    // If production, could send to external monitoring service
    if (process.env.NODE_ENV === 'production' && log.status === 'error') {
      this.reportError(entry);
    }
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 20): AdminOperationLog[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Get logs filtered by operation type
   */
  getLogsByOperation(operation: AdminOperationLog['operation']): AdminOperationLog[] {
    return this.logs.filter(log => log.operation === operation);
  }

  /**
   * Get error logs
   */
  getErrorLogs(): AdminOperationLog[] {
    return this.logs.filter(log => log.status === 'error');
  }

  /**
   * Get success rate for an operation
   */
  getSuccessRate(operation?: AdminOperationLog['operation']): number {
    const relevantLogs = operation
      ? this.getLogsByOperation(operation)
      : this.logs;

    if (relevantLogs.length === 0) return 100;

    const successCount = relevantLogs.filter(log => log.status === 'success').length;
    return (successCount / relevantLogs.length) * 100;
  }

  /**
   * Report error to external monitoring service
   * In production, this could send to Sentry, DataDog, etc.
   */
  private reportError(log: AdminOperationLog): void {
    // Placeholder for external error reporting
    // Could integrate with Sentry, Vercel Analytics, etc.
    if (process.env.ADMIN_EMAIL) {
      console.log(`📧 Would send error notification to: ${process.env.ADMIN_EMAIL}`);
    }
  }

  /**
   * Create a performance timer
   */
  startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }
}

// Export singleton instance
export const adminMonitor = new AdminMonitoringService();

// Helper function to wrap operations with monitoring
export async function monitorOperation<T>(
  operation: AdminOperationLog['operation'],
  user: string | undefined,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const timer = adminMonitor.startTimer();

  try {
    const result = await fn();
    adminMonitor.log({
      operation,
      status: 'success',
      user,
      metadata,
      duration: timer()
    });
    return result;
  } catch (error) {
    adminMonitor.log({
      operation,
      status: 'error',
      user,
      metadata,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: timer()
    });
    throw error;
  }
}
