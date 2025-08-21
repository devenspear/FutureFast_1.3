import NotificationService from './notification-service';
import EnhancedNotionClient from './enhanced-notion-client';

interface HealthStatus {
  isHealthy: boolean;
  issues: string[];
  lastProcessedTime?: string;
  failureRate: number;
  totalArticles: number;
  successfulArticles: number;
}

export class HealthMonitor {
  private notificationService: NotificationService;
  private notionClient: EnhancedNotionClient;

  constructor() {
    this.notificationService = new NotificationService();
    this.notionClient = new EnhancedNotionClient();
  }

  /**
   * Check overall system health and send alerts if needed
   */
  async checkSystemHealth(): Promise<HealthStatus> {
    const issues: string[] = [];
    let isHealthy = true;

    try {
      // 1. Check if Notion API is accessible
      console.log('🏥 Checking Notion API connectivity...');
      await this.checkNotionConnectivity(issues);

      // 2. Check recent processing activity (last 24 hours)
      console.log('🏥 Checking recent processing activity...');
      const processingHealth = await this.checkRecentProcessingActivity(issues);

      // 3. Check failure rate from recent CRON runs
      console.log('🏥 Checking failure rates...');
      await this.checkFailureRates(issues);

      // 4. Check for unprocessed articles that are stuck
      console.log('🏥 Checking for stuck articles...');
      await this.checkStuckArticles(issues);

      isHealthy = issues.length === 0;

      const healthStatus: HealthStatus = {
        isHealthy,
        issues,
        lastProcessedTime: processingHealth.lastProcessedTime,
        failureRate: processingHealth.failureRate,
        totalArticles: processingHealth.totalArticles,
        successfulArticles: processingHealth.successfulArticles
      };

      // Send alert if there are issues
      if (!isHealthy) {
        await this.sendHealthAlert(healthStatus);
      }

      return healthStatus;

    } catch (error) {
      const criticalIssue = `Health monitor failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      issues.push(criticalIssue);
      
      await this.notificationService.sendCriticalError(
        'Health monitoring system failure',
        { error: criticalIssue, timestamp: new Date().toISOString() }
      );

      return {
        isHealthy: false,
        issues,
        failureRate: 100,
        totalArticles: 0,
        successfulArticles: 0
      };
    }
  }

  /**
   * Check if Notion API is accessible
   */
  private async checkNotionConnectivity(issues: string[]): Promise<void> {
    try {
      // Try to fetch a small amount of data to test connectivity
      await this.notionClient.getAllContent(1); // Just get 1 record
      console.log('✅ Notion API connectivity: OK');
    } catch (error) {
      const issue = `Notion API connectivity failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      issues.push(issue);
      console.log('❌ Notion API connectivity: FAILED');
    }
  }

  /**
   * Check recent processing activity
   */
  private async checkRecentProcessingActivity(issues: string[]): Promise<{
    lastProcessedTime?: string;
    failureRate: number;
    totalArticles: number;
    successfulArticles: number;
  }> {
    try {
      // Get all articles and check their processing status
      const allArticles = await this.notionClient.getAllContent();
      const publishedArticles = allArticles.filter(article => article.status === 'Published');
      
      const processedArticles = publishedArticles.filter(article => article.processed);
      const recentArticles = publishedArticles.filter(article => {
        const pubDate = new Date(article.publishedDate || '');
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return pubDate > oneDayAgo;
      });

      const successfulArticles = processedArticles.length;
      const totalArticles = publishedArticles.length;
      const failureRate = totalArticles > 0 ? ((totalArticles - successfulArticles) / totalArticles) * 100 : 0;

      // Find most recent processed article
      const lastProcessed = processedArticles
        .filter(article => article.lastProcessed)
        .sort((a, b) => new Date(b.lastProcessed!).getTime() - new Date(a.lastProcessed!).getTime())[0];

      const lastProcessedTime = lastProcessed?.lastProcessed;

      // Check if no articles have been processed in 24 hours
      if (lastProcessedTime) {
        const lastProcessedDate = new Date(lastProcessedTime);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        if (lastProcessedDate < oneDayAgo) {
          issues.push(`No articles processed in the last 24 hours. Last processed: ${lastProcessedTime}`);
        }
      } else if (publishedArticles.length > 0) {
        issues.push('No articles have been processed yet, but published articles exist');
      }

      // Check if failure rate is too high (>50%)
      if (failureRate > 50 && totalArticles > 0) {
        issues.push(`High failure rate: ${failureRate.toFixed(1)}% (${totalArticles - successfulArticles}/${totalArticles} failed)`);
      }

      // Check if there are recent unprocessed articles
      if (recentArticles.length > 0) {
        const unprocessedRecent = recentArticles.filter(article => !article.processed);
        if (unprocessedRecent.length > 3) {
          issues.push(`${unprocessedRecent.length} recent articles are unprocessed (may indicate CRON job issues)`);
        }
      }

      return {
        lastProcessedTime,
        failureRate,
        totalArticles,
        successfulArticles
      };

    } catch (error) {
      issues.push(`Failed to check processing activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        failureRate: 100,
        totalArticles: 0,
        successfulArticles: 0
      };
    }
  }

  /**
   * Check failure rates from environment variables or logs
   */
  private async checkFailureRates(_issues: string[]): Promise<void> {
    // This could be enhanced to check actual logs or store failure metrics
    // For now, we rely on the processing activity check above
    console.log('✅ Failure rate check completed (via processing activity)');
  }

  /**
   * Check for articles that might be stuck in processing
   */
  private async checkStuckArticles(issues: string[]): Promise<void> {
    try {
      const allArticles = await this.notionClient.getAllContent();
      const publishedArticles = allArticles.filter(article => article.status === 'Published');
      
      const oldUnprocessed = publishedArticles.filter(article => {
        if (article.processed) return false;
        
        // Check if article was added more than 1 day ago but never processed
        const createdDate = article.lastProcessed ? new Date(article.lastProcessed) : new Date();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        return createdDate < oneDayAgo;
      });

      if (oldUnprocessed.length > 5) {
        issues.push(`${oldUnprocessed.length} articles appear stuck (unprocessed for >24 hours)`);
      }

    } catch (error) {
      issues.push(`Failed to check stuck articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send health alert notification
   */
  private async sendHealthAlert(healthStatus: HealthStatus): Promise<void> {
    const subject = `🚨 FutureFast System Health Alert - ${healthStatus.issues.length} Issue(s) Detected`;
    
    const message = `
System Health Check Failed!

Issues Detected:
${healthStatus.issues.map(issue => `• ${issue}`).join('\n')}

System Status:
• Total Articles: ${healthStatus.totalArticles}
• Successfully Processed: ${healthStatus.successfulArticles}
• Failure Rate: ${healthStatus.failureRate.toFixed(1)}%
• Last Processed: ${healthStatus.lastProcessedTime || 'Unknown'}

Please check the CRON job and Notion integration.

Time: ${new Date().toISOString()}
`;

    await this.notificationService.sendEmail({
      subject,
      message,
      severity: 'error',
      details: healthStatus
    });
  }

  /**
   * Send a "system healthy" notification (optional, for peace of mind)
   */
  async sendHealthyStatusUpdate(healthStatus: HealthStatus): Promise<void> {
    const message = `
✅ FutureFast System Health: ALL GOOD

• Total Articles: ${healthStatus.totalArticles}
• Successfully Processed: ${healthStatus.successfulArticles}
• Failure Rate: ${healthStatus.failureRate.toFixed(1)}%
• Last Processed: ${healthStatus.lastProcessedTime || 'Unknown'}

System is operating normally.

Time: ${new Date().toISOString()}
`;

    await this.notificationService.sendEmail({
      subject: '✅ FutureFast System Health: All Systems Operational',
      message,
      severity: 'info',
      details: healthStatus
    });
  }
}

export default HealthMonitor;