interface NotificationOptions {
  subject: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  details?: any;
}

class NotificationService {
  private adminEmail: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@futurefast.ai';
  }

  /**
   * Send email notification using a simple email service
   */
  async sendEmail(options: NotificationOptions): Promise<void> {
    try {
      console.log(`📧 Sending ${options.severity} notification: ${options.subject}`);
      
      // If we have Resend API key, use that
      if (process.env.RESEND_API_KEY) {
        await this.sendWithResend(options);
      } else if (process.env.SENDGRID_API_KEY) {
        await this.sendWithSendGrid(options);
      } else {
        // Log to console as fallback
        console.log(`📧 EMAIL NOTIFICATION (no email service configured):`);
        console.log(`To: ${this.adminEmail}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        if (options.details) {
          console.log(`Details:`, JSON.stringify(options.details, null, 2));
        }
      }
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
  }

  /**
   * Send notification using Resend
   */
  private async sendWithResend(options: NotificationOptions): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FutureFast.AI <alerts@futurefast.ai>',
        to: [this.adminEmail],
        subject: `[${options.severity.toUpperCase()}] ${options.subject}`,
        html: `
          <h2>FutureFast.AI Content Processing Alert</h2>
          <p><strong>Severity:</strong> ${options.severity.toUpperCase()}</p>
          <p><strong>Message:</strong> ${options.message}</p>
          ${options.details ? `<pre>${JSON.stringify(options.details, null, 2)}</pre>` : ''}
          <hr>
          <p><small>Time: ${new Date().toISOString()}</small></p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status}`);
    }

    console.log('✅ Email sent via Resend');
  }

  /**
   * Send notification using SendGrid
   */
  private async sendWithSendGrid(options: NotificationOptions): Promise<void> {
    // SendGrid implementation would go here
    console.log('📧 SendGrid email sending not yet implemented');
  }

  /**
   * Send processing summary notification
   */
  async sendProcessingSummary(stats: any): Promise<void> {
    const severity = stats.failed > 0 ? 'error' : stats.successful > 0 ? 'info' : 'warning';
    
    await this.sendEmail({
      subject: `Content Processing Complete: ${stats.successful}/${stats.total} successful`,
      message: `Cron job completed with ${stats.successful} successful and ${stats.failed} failed out of ${stats.total} total records.`,
      severity,
      details: stats
    });
  }

  /**
   * Send critical error notification
   */
  async sendCriticalError(error: string, context?: any): Promise<void> {
    await this.sendEmail({
      subject: 'Critical Error in Content Processing',
      message: `A critical error occurred during content processing: ${error}`,
      severity: 'error',
      details: { error, context, timestamp: new Date().toISOString() }
    });
  }
}

export default NotificationService; 