# Quick Setup - Form Notifications

## 🚀 Fast Setup (5 Minutes)

### 1. Add to Vercel Environment Variables

Go to: [vercel.com/dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

```env
ADMIN_EMAIL=deven@deven.email
RESEND_API_KEY=your_resend_api_key_here
MAILERLITE_WEBHOOK_SECRET=futurefast_webhook_2025_secure
```

### 2. Deploy

```bash
git push origin main
```

### 3. Configure MailerLite Webhook

1. Go to: [app.mailerlite.com/integrations/webhooks](https://app.mailerlite.com/integrations/webhooks)
2. Click **Create Webhook**
3. Enter:
   - **URL**: `https://futurefast.ai/api/webhooks/mailerlite`
   - **Events**: Check `subscriber.created` and `subscriber.added`
4. Save

### 4. Test

Go to [futurefast.ai](https://futurefast.ai) and submit the form.

You should receive an email at **deven@deven.email** within seconds! 🎉

---

**Need help?** See [FORM_NOTIFICATION_SETUP.md](./docs/FORM_NOTIFICATION_SETUP.md) for detailed instructions.
