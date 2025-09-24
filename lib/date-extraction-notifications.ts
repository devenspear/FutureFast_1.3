import NotificationService from './notification-service';
import EnhancedNotionClient, { EnhancedNotionItem } from './enhanced-notion-client';

export interface ReviewAlert {
  type: 'date_extraction_review' | 'critical_failure' | 'daily_digest';
  priority: 'Critical' | 'High' | 'Standard' | 'Low';
  records: EnhancedNotionItem[];
  summary: {
    totalNeeding: number;
    criticalCount: number;
    highCount: number;
    avgConfidence: number;
    topProblematicSources: { [domain: string]: number };
  };
}

export class DateExtractionNotificationService {
  private notificationService: NotificationService;
  private notionClient: EnhancedNotionClient;

  constructor() {
    this.notificationService = new NotificationService();
    this.notionClient = new EnhancedNotionClient();
  }

  /**
   * Send immediate alert for critical date extraction failures
   */
  async sendCriticalAlert(records: EnhancedNotionItem[]): Promise<void> {
    if (records.length === 0) return;

    const criticalRecords = records.filter(r =>
      r.reviewPriority === 'Critical' ||
      (r.dateConfidence !== undefined && r.dateConfidence === 0)
    );

    if (criticalRecords.length === 0) return;

    const alert: ReviewAlert = {
      type: 'critical_failure',
      priority: 'Critical',
      records: criticalRecords,
      summary: this.generateSummary(criticalRecords)
    };

    await this.sendAlert(alert);
  }

  /**
   * Send daily digest of articles needing review
   */
  async sendDailyDigest(): Promise<void> {
    try {
      const reviewRecords = await this.notionClient.getRecordsNeedingReview();

      if (reviewRecords.length === 0) {
        console.log('✅ No articles need review - skipping daily digest');
        return;
      }

      const alert: ReviewAlert = {
        type: 'daily_digest',
        priority: 'Standard',
        records: reviewRecords,
        summary: this.generateSummary(reviewRecords)
      };

      await this.sendAlert(alert);
    } catch (error) {
      console.error('❌ Failed to send daily digest:', error);
    }
  }

  /**
   * Send alert for high-volume review requirements
   */
  async checkAndSendVolumeAlert(): Promise<void> {
    try {
      const reviewRecords = await this.notionClient.getRecordsNeedingReview();
      const highPriorityRecords = reviewRecords.filter(r =>
        r.reviewPriority === 'Critical' || r.reviewPriority === 'High'
      );

      // Send alert if more than 5 high-priority items need review
      if (highPriorityRecords.length >= 5) {
        const alert: ReviewAlert = {
          type: 'date_extraction_review',
          priority: 'High',
          records: highPriorityRecords,
          summary: this.generateSummary(reviewRecords)
        };

        await this.sendAlert(alert);
      }
    } catch (error) {
      console.error('❌ Failed to check volume alert:', error);
    }
  }

  /**
   * Generate summary statistics for review records
   */
  private generateSummary(records: EnhancedNotionItem[]): ReviewAlert['summary'] {
    const criticalCount = records.filter(r => r.reviewPriority === 'Critical').length;
    const highCount = records.filter(r => r.reviewPriority === 'High').length;

    // Calculate average confidence
    const confidenceRecords = records.filter(r => r.dateConfidence !== undefined);
    const avgConfidence = confidenceRecords.length > 0 ?
      Math.round(confidenceRecords.reduce((sum, r) => sum + (r.dateConfidence || 0), 0) / confidenceRecords.length) :
      0;

    // Count problematic sources
    const problematicSources: { [domain: string]: number } = {};
    records.forEach(record => {
      if (record.sourceUrl && (record.dateConfidence === undefined || record.dateConfidence < 60)) {
        try {
          const domain = new URL(record.sourceUrl).hostname.replace('www.', '');
          problematicSources[domain] = (problematicSources[domain] || 0) + 1;
        } catch {
          // Invalid URL, skip
        }
      }
    });

    // Get top 5 problematic sources
    const topProblematicSources = Object.entries(problematicSources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [domain, count]) => {
        obj[domain] = count;
        return obj;
      }, {} as { [domain: string]: number });

    return {
      totalNeeding: records.length,
      criticalCount,
      highCount,
      avgConfidence,
      topProblematicSources
    };
  }

  /**
   * Send alert using the notification service
   */
  private async sendAlert(alert: ReviewAlert): Promise<void> {
    const title = this.getAlertTitle(alert);
    const details = this.formatAlertDetails(alert);

    try {
      if (alert.priority === 'Critical') {
        await this.notificationService.sendCriticalError(title, details);
      } else {
        // Use processing summary for non-critical alerts
        const fakeStats = {
          total: alert.records.length,
          successful: 0,
          failed: alert.records.length,
          newsArticles: alert.records.filter(r => r.contentType === 'News Article').length,
          youtubeVideos: alert.records.filter(r => r.contentType === 'YouTube Video').length,
          results: []
        };
        await this.notificationService.sendProcessingSummary(fakeStats);
      }

      console.log(`✅ Sent ${alert.type} notification for ${alert.records.length} records`);
    } catch (error) {
      console.error('❌ Failed to send alert:', error);
    }
  }

  /**
   * Get appropriate title for alert type
   */
  private getAlertTitle(alert: ReviewAlert): string {
    switch (alert.type) {
      case 'critical_failure':
        return `🚨 Critical Date Extraction Failures: ${alert.summary.criticalCount} records need immediate review`;
      case 'date_extraction_review':
        return `⚠️ High Volume Review Alert: ${alert.summary.totalNeeding} articles need date review`;
      case 'daily_digest':
        return `📋 Daily Review Digest: ${alert.summary.totalNeeding} articles awaiting review`;
      default:
        return `📅 Date Extraction Alert: ${alert.summary.totalNeeding} records`;
    }
  }

  /**
   * Format alert details for notification
   */
  private formatAlertDetails(alert: ReviewAlert): any {
    const topRecords = alert.records
      .sort((a, b) => {
        // Sort by priority then confidence
        const priorityOrder = { 'Critical': 0, 'High': 1, 'Standard': 2, 'Low': 3 };
        const aPriority = priorityOrder[a.reviewPriority || 'Standard'];
        const bPriority = priorityOrder[b.reviewPriority || 'Standard'];

        if (aPriority !== bPriority) return aPriority - bPriority;
        return (a.dateConfidence || 0) - (b.dateConfidence || 0);
      })
      .slice(0, 10) // Top 10 items
      .map(record => ({
        title: record.title,
        url: record.sourceUrl,
        priority: record.reviewPriority,
        confidence: record.dateConfidence,
        method: record.dateExtractionMethod,
        notes: record.dateExtractionNotes?.substring(0, 100) + '...'
      }));

    return {
      summary: alert.summary,
      alertType: alert.type,
      priority: alert.priority,
      topRecords,
      reviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'}/api/admin/date-extraction-dashboard`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process new records and send alerts as needed
   */
  async processNewRecordsForAlerts(records: EnhancedNotionItem[]): Promise<void> {
    const recordsNeedingReview = records.filter(r => r.needsReview);

    if (recordsNeedingReview.length === 0) return;

    // Send critical alerts immediately
    await this.sendCriticalAlert(recordsNeedingReview);

    // Check if volume threshold is met
    await this.checkAndSendVolumeAlert();

    console.log(`📊 Processed ${records.length} new records, ${recordsNeedingReview.length} need review`);
  }
}