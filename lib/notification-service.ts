interface NotificationOptions {
  subject: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  details?: any;
}

class NotificationService {
  private adminEmail: string;
  private mailerLiteApiKey: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@futurefast.ai';
    this.mailerLiteApiKey = process.env.MAILERLITE_API_KEY || '';
  }

  /**
   * Send email notification using MailerLite (preferred) or fallback options
   */
  async sendEmail(options: NotificationOptions): Promise<void> {
    try {
      console.log(`📧 Sending ${options.severity} notification: ${options.subject}`);
      
      // Primary: Use MailerLite (since already integrated with project)
      if (this.mailerLiteApiKey) {
        await this.sendWithMailerLite(options);
      } else if (process.env.RESEND_API_KEY) {
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
   * Send notification using MailerLite transactional emails
   */
  private async sendWithMailerLite(options: NotificationOptions): Promise<void> {
    const severityEmoji = {
      'info': '✅',
      'warning': '⚠️', 
      'error': '❌'
    };

    const response = await fetch('https://connect.mailerlite.com/api/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.mailerLiteApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        to: [
          {
            email: this.adminEmail,
            name: 'FutureFast.AI Admin'
          }
        ],
        from: {
          email: 'alerts@futurefast.ai',
          name: 'FutureFast.AI System'
        },
        subject: `${severityEmoji[options.severity]} ${options.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">FutureFast.AI Alert</h1>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">
                  ${severityEmoji[options.severity]} ${options.severity.toUpperCase()} ALERT
                </h2>
                
                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                  <strong>Message:</strong> ${options.message}
                </p>
                
                ${options.details ? `
                  <div style="background: #f1f3f4; padding: 15px; border-radius: 4px; margin: 15px 0;">
                    <strong>Details:</strong>
                    <pre style="margin: 10px 0; white-space: pre-wrap; font-size: 12px; color: #333;">${JSON.stringify(options.details, null, 2)}</pre>
                  </div>
                ` : ''}
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                
                <p style="font-size: 12px; color: #999; margin-bottom: 0;">
                  <strong>Time:</strong> ${new Date().toISOString()}<br>
                  <strong>System:</strong> FutureFast.AI Content Processing<br>
                  <strong>Dashboard:</strong> <a href="https://futurefast.ai/admin">Admin Panel</a>
                </p>
              </div>
            </div>
          </div>
        `,
        text: `
FutureFast.AI Alert - ${options.severity.toUpperCase()}

Message: ${options.message}

${options.details ? `Details: ${JSON.stringify(options.details, null, 2)}` : ''}

Time: ${new Date().toISOString()}
Dashboard: https://futurefast.ai/admin
        `
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`MailerLite API error: ${response.status} - ${errorData}`);
    }

    console.log('✅ Email sent via MailerLite');
  }

  /**
   * Send notification using Resend (fallback)
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
   * Send notification using SendGrid (fallback)
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

  /**
   * Send notification when new content is added to Notion
   */
  async sendNewContentAlert(title: string, sourceUrl: string): Promise<void> {
    await this.sendEmail({
      subject: 'New Content Added to Notion - Processing Started',
      message: `New content "${title}" has been added to Notion and will be processed in the next cron cycle.`,
      severity: 'info',
      details: { 
        title, 
        sourceUrl, 
        nextCronCycle: 'Every 2 hours at: 01:00, 03:00, 13:00, 15:00, 17:00, 19:00, 21:00, 23:00 UTC',
        notionDashboard: 'https://notion.so'
      }
    });
  }
}

export default NotificationService; 