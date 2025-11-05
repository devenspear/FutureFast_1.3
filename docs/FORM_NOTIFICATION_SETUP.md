# Form Submission Notifications Setup Guide

This guide will help you set up email and SMS notifications for form submissions on FutureFast.AI.

## Overview

When a user submits the subscription form on your website, you'll receive:
- **Email notification** with full submission details
- **SMS text message** with key information (if configured)

## Configuration Steps

### 1. Email Notifications Setup

The system supports multiple email providers. Choose one:

#### Option A: MailerLite (Recommended - Already Integrated)

1. Log in to your [MailerLite account](https://www.mailerlite.com/)
2. Navigate to **Integrations** → **API**
3. Generate a new API key
4. Add to Vercel environment variables:
   ```bash
   MAILERLITE_API_KEY=your_mailerlite_api_key_here
   ADMIN_EMAIL=your-email@example.com
   ```

#### Option B: Resend (Alternative)

1. Sign up at [Resend.com](https://resend.com/)
2. Create an API key in the dashboard
3. Verify your sending domain
4. Add to Vercel environment variables:
   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   ADMIN_EMAIL=your-email@example.com
   ```

#### Option C: SendGrid (Alternative)

1. Sign up at [SendGrid.com](https://sendgrid.com/)
2. Create an API key with "Mail Send" permissions
3. Verify your sending domain
4. Add to Vercel environment variables:
   ```bash
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   ADMIN_EMAIL=your-email@example.com
   ```

### 2. SMS Notifications Setup (Optional)

To receive text messages for form submissions:

#### Step 1: Create Twilio Account

1. Sign up at [Twilio.com](https://www.twilio.com/)
2. Get a phone number in the Twilio dashboard
3. Note your Account SID and Auth Token

#### Step 2: Add Twilio Credentials

Add these to Vercel environment variables:

```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_PHONE=+1234567890
```

**Important Notes:**
- `TWILIO_PHONE_NUMBER` is your Twilio phone number (sender)
- `ADMIN_PHONE` is YOUR phone number (where you'll receive messages)
- Both numbers must be in E.164 format: `+[country code][number]`
- Example: `+14155552671`

## Setting Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/)
2. Select your FutureFast project
3. Navigate to **Settings** → **Environment Variables**
4. Add the required variables for your chosen services
5. Click **Save**
6. Redeploy your application or wait for the next auto-deployment

## Testing the Notifications

### Local Testing

1. Create a `.env.local` file in your project root:
   ```bash
   # Email Configuration (choose one)
   MAILERLITE_API_KEY=your_key_here
   ADMIN_EMAIL=your-email@example.com

   # SMS Configuration (optional)
   TWILIO_ACCOUNT_SID=your_sid_here
   TWILIO_AUTH_TOKEN=your_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ADMIN_PHONE=+1234567890
   ```

2. Run your development server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000` and submit the form

4. Check your email and phone for notifications

### Production Testing

1. After setting up environment variables in Vercel
2. Wait for deployment to complete
3. Visit your live site at `https://futurefast.ai`
4. Submit a test form
5. Check your email and phone

## Notification Details

### Email Notification Contains:
- Subscriber's first name and last name
- Email address
- Company name (if provided)
- Timestamp of submission
- Direct link to admin dashboard

### SMS Notification Contains:
- Subscriber's name
- Email address
- Company (if provided)
- Link to admin dashboard

## Troubleshooting

### Not Receiving Email Notifications?

1. **Check environment variables** in Vercel dashboard
2. **Verify API key** is correct and active
3. **Check spam folder** - emails might be filtered
4. **Review Vercel logs** for error messages:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → Functions
   - Look for `/api/subscribe` logs

### Not Receiving SMS Notifications?

1. **Verify phone number format** - must be E.164 (+1234567890)
2. **Check Twilio balance** - ensure you have credits
3. **Verify phone number** - Twilio trial accounts require verification
4. **Review Twilio logs** at [Twilio Console](https://console.twilio.com/)
5. **Check Vercel logs** for Twilio API errors

### Silent Failures

The notification system is designed to fail gracefully:
- If notifications fail, the form submission still succeeds
- Errors are logged to console but don't block user registration
- Check Vercel function logs to debug notification issues

## Cost Considerations

### Email Services (Monthly)
- **MailerLite**: Free up to 12,000 emails/month
- **Resend**: Free up to 3,000 emails/month
- **SendGrid**: Free up to 100 emails/day

### SMS Services
- **Twilio**: Pay-as-you-go
  - ~$0.0079 per SMS in the US
  - Requires account balance (minimum $20)
  - Trial accounts get $15 credit

## Security Best Practices

1. **Never commit** API keys or credentials to Git
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** - update every 90 days
4. **Monitor usage** - check for unexpected spikes
5. **Use strong passwords** for third-party service accounts

## Advanced Configuration

### Custom Email Templates

Edit the email template in `/lib/notification-service.ts` line 76-108 to customize:
- Colors and branding
- Email structure
- Additional information fields

### Custom SMS Format

Edit the SMS message format in `/lib/notification-service.ts` line 291 to customize:
- Message length (keep under 160 characters for single SMS)
- Information included
- Link shortening

### Rate Limiting

Consider adding rate limiting to prevent spam:
- Implement Cloudflare Turnstile (CAPTCHA)
- Add IP-based rate limiting
- Use Vercel Edge Config for distributed rate limiting

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review third-party service dashboards (Twilio, MailerLite)
3. Test with console.log in development mode
4. Verify all environment variables are set correctly

## Related Documentation

- [Notification Service Setup](./NOTIFICATION_SETUP.md)
- [Blob Storage Setup](./BLOB_STORAGE_SETUP.md)
- [Admin Authentication](./ADMIN_AUTH.md)
