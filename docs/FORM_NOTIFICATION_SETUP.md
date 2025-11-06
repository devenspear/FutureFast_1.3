# Form Submission Notification Setup

Get instant email notifications when someone signs up for your newsletter at futurefast.ai.

## How It Works

```
User submits form → MailerLite → Webhook → Resend → Email to deven@deven.email
```

## Setup Steps

### 1. Add Environment Variables

Add to Vercel project:

```env
ADMIN_EMAIL=deven@deven.email
RESEND_API_KEY=your_resend_api_key_here
MAILERLITE_WEBHOOK_SECRET=futurefast_webhook_2025_secure
```

### 2. Configure MailerLite Webhook

1. Go to: https://app.mailerlite.com/integrations/webhooks
2. Create new webhook:
   - URL: `https://futurefast.ai/api/webhooks/mailerlite`
   - Events: `subscriber.created`, `subscriber.added`

### 3. Test

Submit a test form at futurefast.ai - you should receive a beautiful email notification instantly!

## Notification Features

✅ Beautiful HTML email with subscriber details
✅ Resend for fast delivery (MailerLite as fallback)
✅ IP address tracking
✅ Direct link to MailerLite dashboard
✅ Handles multiple webhook events (signups, unsubscribes, bounces)

## Troubleshooting

**Not receiving emails?**

1. Check Vercel logs: `vercel logs`
2. Test webhook endpoint: `curl https://futurefast.ai/api/webhooks/mailerlite`
3. Verify environment variables are set in Vercel
4. Check MailerLite webhook delivery logs

**Test webhook manually:**

```bash
curl -X POST https://futurefast.ai/api/webhooks/mailerlite \
  -H "Content-Type: application/json" \
  -H "x-mailerlite-signature: futurefast_webhook_2025_secure" \
  -d '{"events":[{"type":"subscriber.created","data":{"subscriber":{"email":"test@example.com","fields":{"name":"Test User"}}}}]}'
```

## Files

- `/src/app/api/webhooks/mailerlite/route.ts` - Webhook handler
- `/lib/notification-service.ts` - Email service with Resend/MailerLite
- `QUICK_SETUP.md` - 5-minute setup guide

---

Built with Claude Code • Powered by Resend & MailerLite
