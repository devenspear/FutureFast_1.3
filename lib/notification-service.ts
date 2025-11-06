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

  /**
   * Send notification when someone submits the newsletter signup form
   */
  async sendFormSubmissionAlert(params: {
    subscriberEmail: string;
    subscriberName?: string;
    source?: string;
    subscribedAt?: string;
    ipAddress?: string;
    groupName?: string;
    fields?: any;
  }): Promise<void> {
    const { subscriberEmail, subscriberName, source, subscribedAt, ipAddress, groupName, fields } = params;

    // Try Resend first (better for transactional emails)
    // Then fall back to MailerLite if Resend fails
    try {
      if (process.env.RESEND_API_KEY) {
        await this.sendFormSubmissionWithResend(params);
      } else if (this.mailerLiteApiKey) {
        await this.sendFormSubmissionWithMailerLite(params);
      } else {
        // Console fallback
        console.log('📧 NEW FORM SUBMISSION (no email service configured):');
        console.log(`Subscriber: ${subscriberName || 'Unknown'} <${subscriberEmail}>`);
        console.log(`Source: ${source || 'Unknown'}`);
        console.log(`Time: ${subscribedAt || new Date().toISOString()}`);
      }
    } catch (error) {
      console.error('❌ Failed to send form submission notification:', error);
      // Fallback to generic sendEmail if Resend/MailerLite-specific methods fail
      await this.sendEmail({
        subject: '🎉 New Signup at FutureFast.AI',
        message: `New subscriber: ${subscriberName || 'Unknown'} <${subscriberEmail}>`,
        severity: 'info',
        details: { subscriberEmail, subscriberName, source, subscribedAt, ipAddress, groupName, fields }
      });
    }
  }

  /**
   * Send form submission notification using Resend (preferred for transactional emails)
   */
  private async sendFormSubmissionWithResend(params: {
    subscriberEmail: string;
    subscriberName?: string;
    source?: string;
    subscribedAt?: string;
    ipAddress?: string;
    groupName?: string;
    fields?: any;
  }): Promise<void> {
    const { subscriberEmail, subscriberName, source, subscribedAt, ipAddress, groupName, fields } = params;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FutureFast.AI <alerts@futurefast.ai>',
        to: [this.adminEmail],
        subject: '🎉 New Signup at FutureFast.AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Subscriber!</h1>
            </div>

            <div style="padding: 30px; background: #ffffff;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0; font-size: 20px;">Subscription Details</h2>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">Name:</td>
                    <td style="padding: 12px 0; color: #333;">${subscriberName || 'Not provided'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 12px 0;"><a href="mailto:${subscriberEmail}" style="color: #667eea; text-decoration: none;">${subscriberEmail}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">Source:</td>
                    <td style="padding: 12px 0; color: #333;">${source || 'Website form'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">Group:</td>
                    <td style="padding: 12px 0; color: #333;">${groupName || 'Default'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">Time:</td>
                    <td style="padding: 12px 0; color: #333;">${subscribedAt ? new Date(subscribedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) : 'Just now'}</td>
                  </tr>
                  ${ipAddress ? `
                  <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #555;">IP Address:</td>
                    <td style="padding: 12px 0; color: #666; font-size: 12px;">${ipAddress}</td>
                  </tr>
                  ` : ''}
                </table>

                ${fields && Object.keys(fields).length > 0 ? `
                  <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px;">
                    <strong style="color: #555;">Additional Fields:</strong>
                    <pre style="margin: 10px 0; font-size: 12px; color: #666; white-space: pre-wrap;">${JSON.stringify(fields, null, 2)}</pre>
                  </div>
                ` : ''}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://app.mailerlite.com/subscribers"
                   style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View in MailerLite Dashboard
                </a>
              </div>

              <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>💡 Pro Tip:</strong> This subscriber will automatically receive your welcome email series.
                </p>
              </div>
            </div>

            <div style="padding: 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                FutureFast.AI Notification System • <a href="https://futurefast.ai" style="color: #667eea; text-decoration: none;">futurefast.ai</a>
              </p>
            </div>
          </div>
        `,
        text: `
🎉 NEW SUBSCRIBER AT FUTUREFAST.AI

Subscription Details:
────────────────────────────────────
Name: ${subscriberName || 'Not provided'}
Email: ${subscriberEmail}
Source: ${source || 'Website form'}
Group: ${groupName || 'Default'}
Time: ${subscribedAt ? new Date(subscribedAt).toLocaleString() : 'Just now'}
${ipAddress ? `IP Address: ${ipAddress}` : ''}

${fields && Object.keys(fields).length > 0 ? `
Additional Fields:
${JSON.stringify(fields, null, 2)}
` : ''}

View in MailerLite Dashboard:
https://app.mailerlite.com/subscribers

────────────────────────────────────
FutureFast.AI Notification System
https://futurefast.ai
        `
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error: ${response.status} - ${errorText}`);
    }

    console.log('✅ Form submission notification sent via Resend');
  }

  /**
   * Send form submission notification using MailerLite (fallback)
   */
  private async sendFormSubmissionWithMailerLite(params: {
    subscriberEmail: string;
    subscriberName?: string;
    source?: string;
    subscribedAt?: string;
    ipAddress?: string;
    groupName?: string;
    fields?: any;
  }): Promise<void> {
    const { subscriberEmail, subscriberName, source, subscribedAt, ipAddress, groupName, fields } = params;

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
        subject: '🎉 New Signup at FutureFast.AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Subscriber!</h1>
            </div>

            <div style="padding: 30px; background: #ffffff;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <h2 style="color: #333; margin-top: 0;">Subscription Details</h2>
                <p style="margin: 10px 0; color: #555;"><strong>Name:</strong> ${subscriberName || 'Not provided'}</p>
                <p style="margin: 10px 0; color: #555;"><strong>Email:</strong> <a href="mailto:${subscriberEmail}" style="color: #667eea;">${subscriberEmail}</a></p>
                <p style="margin: 10px 0; color: #555;"><strong>Source:</strong> ${source || 'Website form'}</p>
                <p style="margin: 10px 0; color: #555;"><strong>Time:</strong> ${subscribedAt ? new Date(subscribedAt).toLocaleString() : 'Just now'}</p>
                ${ipAddress ? `<p style="margin: 10px 0; color: #555;"><strong>IP:</strong> ${ipAddress}</p>` : ''}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://app.mailerlite.com/subscribers"
                   style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                  View in Dashboard
                </a>
              </div>
            </div>
          </div>
        `,
        text: `
🎉 NEW SUBSCRIBER AT FUTUREFAST.AI

Name: ${subscriberName || 'Not provided'}
Email: ${subscriberEmail}
Source: ${source || 'Website form'}
Time: ${subscribedAt ? new Date(subscribedAt).toLocaleString() : 'Just now'}

View in MailerLite: https://app.mailerlite.com/subscribers
        `
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`MailerLite API error: ${response.status} - ${errorData}`);
    }

    console.log('✅ Form submission notification sent via MailerLite');
  }
}

export default NotificationService; 