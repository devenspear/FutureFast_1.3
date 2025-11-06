import { NextRequest, NextResponse } from 'next/server';
import NotificationService from '@/root/lib/notification-service';

/**
 * MailerLite Webhook Handler
 *
 * This endpoint receives webhooks from MailerLite when:
 * - New subscriber signs up via form
 * - Subscriber updates their information
 * - Subscriber unsubscribes
 *
 * Configure this webhook in MailerLite dashboard:
 * https://app.mailerlite.com/integrations/webhooks
 *
 * Webhook URL: https://futurefast.ai/api/webhooks/mailerlite
 */

interface MailerLiteWebhookPayload {
  events: Array<{
    type: string;
    data: {
      subscriber: {
        id: string;
        email: string;
        status: string;
        source: string;
        sent: number;
        opens_count: number;
        clicks_count: number;
        open_rate: number;
        click_rate: number;
        ip_address: string;
        subscribed_at: string;
        unsubscribed_at: string | null;
        created_at: string;
        updated_at: string;
        fields: {
          name?: string;
          last_name?: string;
          company?: string;
          [key: string]: any;
        };
      };
      group: {
        id: string;
        name: string;
      };
    };
    created_at: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret for security
    const webhookSecret = process.env.MAILERLITE_WEBHOOK_SECRET;
    const providedSecret = request.headers.get('x-mailerlite-signature');

    // If webhook secret is configured, verify it
    if (webhookSecret && providedSecret !== webhookSecret) {
      console.error('❌ Invalid MailerLite webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload: MailerLiteWebhookPayload = await request.json();
    console.log('📨 Received MailerLite webhook:', JSON.stringify(payload, null, 2));

    const notificationService = new NotificationService();

    // Process each event in the webhook
    for (const event of payload.events) {
      const { type, data, created_at } = event;
      const subscriber = data.subscriber;

      switch (type) {
        case 'subscriber.created':
        case 'subscriber.added':
          // New signup - send notification to admin
          await notificationService.sendFormSubmissionAlert({
            subscriberEmail: subscriber.email,
            subscriberName: subscriber.fields.name || subscriber.fields.last_name
              ? `${subscriber.fields.name || ''} ${subscriber.fields.last_name || ''}`.trim()
              : undefined,
            source: subscriber.source || 'Unknown',
            subscribedAt: subscriber.subscribed_at || created_at,
            ipAddress: subscriber.ip_address,
            groupName: data.group?.name,
            fields: subscriber.fields
          });

          console.log(`✅ Processed new subscriber: ${subscriber.email}`);
          break;

        case 'subscriber.updated':
          // Subscriber updated their info - optionally notify
          console.log(`📝 Subscriber updated: ${subscriber.email}`);
          // Uncomment if you want notifications for updates:
          // await notificationService.sendEmail({
          //   subject: 'Subscriber Updated Profile',
          //   message: `${subscriber.email} updated their profile`,
          //   severity: 'info'
          // });
          break;

        case 'subscriber.unsubscribed':
          // Subscriber unsubscribed - send notification
          await notificationService.sendEmail({
            subject: 'Subscriber Unsubscribed from FutureFast.AI',
            message: `A subscriber has unsubscribed from your mailing list.`,
            severity: 'warning',
            details: {
              email: subscriber.email,
              name: subscriber.fields.name,
              unsubscribedAt: subscriber.unsubscribed_at,
              totalSent: subscriber.sent,
              openRate: subscriber.open_rate,
              clickRate: subscriber.click_rate
            }
          });

          console.log(`👋 Subscriber unsubscribed: ${subscriber.email}`);
          break;

        case 'subscriber.bounced':
          // Email bounced - send alert
          await notificationService.sendEmail({
            subject: 'Email Bounced - FutureFast.AI',
            message: `An email bounced for subscriber ${subscriber.email}`,
            severity: 'error',
            details: {
              email: subscriber.email,
              name: subscriber.fields.name
            }
          });

          console.log(`⚠️ Email bounced: ${subscriber.email}`);
          break;

        case 'subscriber.complained':
          // Spam complaint - send urgent alert
          await notificationService.sendEmail({
            subject: '🚨 Spam Complaint Received - FutureFast.AI',
            message: `A subscriber marked your email as spam: ${subscriber.email}`,
            severity: 'error',
            details: {
              email: subscriber.email,
              name: subscriber.fields.name,
              message: 'Review your email content and sending practices'
            }
          });

          console.log(`🚨 Spam complaint: ${subscriber.email}`);
          break;

        default:
          console.log(`ℹ️  Unhandled webhook event type: ${type}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      eventsProcessed: payload.events.length
    });

  } catch (error) {
    console.error('❌ Error processing MailerLite webhook:', error);

    // Still return 200 to prevent MailerLite from retrying
    // but log the error for investigation
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/mailerlite',
    message: 'MailerLite webhook endpoint is active',
    expectedEvents: [
      'subscriber.created',
      'subscriber.added',
      'subscriber.updated',
      'subscriber.unsubscribed',
      'subscriber.bounced',
      'subscriber.complained'
    ],
    setup: {
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://futurefast.ai'}/api/webhooks/mailerlite`,
      secretConfigured: !!process.env.MAILERLITE_WEBHOOK_SECRET,
      adminEmail: process.env.ADMIN_EMAIL || 'not configured'
    }
  });
}
