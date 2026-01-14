# FutureFast.ai → Deven CRM Integration Plan

> **Date**: January 14, 2026
> **Version**: 1.0
> **Status**: Planning
> **Prepared by**: Claude (Opus 4.5) + Deven Spear

---

## Executive Summary

This plan outlines the integration of FutureFast.ai's subscription forms with Deven CRM, transitioning from MailerLite to a custom-built email service provider. The approach uses **parallel operation** during transition, submitting to both systems until Deven CRM is fully validated.

### Current State
- **FutureFast.ai**: Uses MailerLiteEmbed component → submits directly to MailerLite
- **MailerLite handles**: Subscriber storage, welcome email automation, list management
- **Admin notifications**: Already use Resend (same provider as Deven CRM)

### Target State
- **FutureFast.ai**: Custom form component → submits to Deven CRM `/api/v1/capture`
- **Deven CRM handles**: Contact storage, welcome email automation, engagement tracking
- **MailerLite**: Sunset after validation period

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CURRENT ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   FutureFast.ai                         MailerLite                       │
│   ┌──────────────────┐                  ┌──────────────────┐            │
│   │ MailerLiteEmbed  │ ──── POST ────→  │ Form Submission  │            │
│   │ Component        │                  │ API              │            │
│   └──────────────────┘                  └────────┬─────────┘            │
│                                                  │                       │
│                                                  ▼                       │
│                                         ┌──────────────────┐            │
│                                         │ Automation       │            │
│                                         │ (Welcome Email)  │            │
│                                         └────────┬─────────┘            │
│                                                  │                       │
│                                                  ▼                       │
│                                         ┌──────────────────┐            │
│   ┌──────────────────┐                  │ Webhook Event    │            │
│   │ /api/webhooks/   │ ◄──── POST ────  │ subscriber.*     │            │
│   │ mailerlite       │                  └──────────────────┘            │
│   └────────┬─────────┘                                                  │
│            │                                                             │
│            ▼                                                             │
│   ┌──────────────────┐                                                  │
│   │ Admin Email      │  (via Resend)                                    │
│   │ Notification     │                                                  │
│   └──────────────────┘                                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        TARGET ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   FutureFast.ai                         Deven CRM                        │
│   ┌──────────────────┐                  ┌──────────────────┐            │
│   │ FutureFastForm   │ ──── POST ────→  │ /api/v1/capture  │            │
│   │ Component        │  (X-API-Key)     │ (public API)     │            │
│   └──────────────────┘                  └────────┬─────────┘            │
│                                                  │                       │
│                                                  ▼                       │
│                                         ┌──────────────────┐            │
│                                         │ Contact Created  │            │
│                                         │ + Auto-Tags      │            │
│                                         └────────┬─────────┘            │
│                                                  │                       │
│                                                  ▼                       │
│                                         ┌──────────────────┐            │
│                                         │ Inngest Event    │            │
│                                         │ contact/captured │            │
│                                         └────────┬─────────┘            │
│                                                  │                       │
│                                         ┌───────┴───────┐               │
│                                         ▼               ▼               │
│                                 ┌──────────────┐ ┌──────────────┐       │
│                                 │ Welcome Email│ │ Admin Alert  │       │
│                                 │ (Autorespond)│ │ Notification │       │
│                                 └──────────────┘ └──────────────┘       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Deven CRM Preparation

### 1.1 Create FutureFast Brand

**Location**: Deven CRM Admin → Settings → Brands

| Field | Value |
|-------|-------|
| Name | FutureFast |
| Slug | futurefast |
| Primary Color | `#7C3AED` (purple-600) |
| Secondary Color | `#1E1B4B` (dark purple) |
| Logo URL | `https://futurefast.ai/logo.png` |
| From Email | `hello@futurefast.ai` (or appropriate sender) |
| From Name | FutureFast |
| Reply-To | `deven@deven.email` |
| Physical Address | [CAN-SPAM required address] |
| Footer Text | "You're receiving this because you signed up at FutureFast.ai" |
| Unsubscribe Text | "Unsubscribe from FutureFast emails" |

### 1.2 Create Welcome Email Template

**Location**: Deven CRM Admin → Templates → New Template

| Field | Value |
|-------|-------|
| Name | FutureFast Welcome |
| Type | AUTORESPONDER |
| Brand | FutureFast |
| Subject | `Welcome to the Future of Faster Thinking, {{firstName}}!` |

**Template Content** (match current MailerLite welcome email):
```html
<!--
NOTE: Before implementing, export the current welcome email from MailerLite:
1. Go to MailerLite Dashboard → Automations
2. Find the FutureFast welcome automation
3. Export/copy the email content
4. Recreate in Deven CRM template editor
-->
```

**Template Variables**:
- `{{firstName}}` - Subscriber's first name
- `{{lastName}}` - Subscriber's last name
- `{{brandName}}` - "FutureFast"
- `{{unsubscribeUrl}}` - Auto-generated unsubscribe link

### 1.3 Create API Key for FutureFast

**Location**: Deven CRM Admin → Settings → API Keys → Create

| Field | Value |
|-------|-------|
| Name | FutureFast Website Form |
| Permissions | `capture` only |
| Auto-Tags | `futurefast`, `website-signup`, `lead` |
| Auto-Source | `futurefast-website` |
| Source Project | `futurefast` |
| Rate Limit (per minute) | 50 |
| Rate Limit (per day) | 2,000 |
| Expiration | None (or 1 year) |

**Save the generated key** - format: `dk_proj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 1.4 Create Tags and Group

**Tags to create**:
- `futurefast` - All contacts from FutureFast
- `website-signup` - Contacts who signed up via website form
- `lead` - Prospects who haven't converted

**Group to create**:
- `FutureFast Subscribers` - All FutureFast email list members

---

## Phase 2: Deven CRM Backend Enhancements

### 2.1 Add Autoresponder Trigger to Capture Endpoint

**File**: `/Users/devenspear/VibeCodingProjects/deven-crm/src/app/api/v1/capture/route.ts`

**Current behavior**: Creates contact, applies tags, returns success
**New behavior**: Also triggers autoresponder if configured

**Required changes**:

```typescript
// After contact creation, check for autoresponder
if (isNew && apiKey.triggerAutoresponder) {
  await inngest.send({
    name: 'contact/captured',
    data: {
      contactId: contact.id,
      sourceProject: apiKey.sourceProject,
      autoresponderTemplateId: apiKey.autoresponderTemplateId,
    },
  });
}
```

### 2.2 Create Inngest Function for Autoresponder

**New file**: `/src/inngest/functions/contact-autoresponder.ts`

```typescript
// contact/captured event handler
// 1. Load contact details
// 2. Load autoresponder template for source project
// 3. Render template with contact variables
// 4. Send email via Resend
// 5. Create EmailLog record
// 6. Send admin notification
```

### 2.3 Extend ProjectApiKey Model

**File**: `prisma/schema.prisma`

Add fields to ProjectApiKey:
```prisma
model ProjectApiKey {
  // ... existing fields
  triggerAutoresponder    Boolean   @default(false)
  autoresponderTemplateId String?
  autoresponderTemplate   EmailTemplate? @relation(fields: [autoresponderTemplateId], references: [id])
  notifyAdminOnCapture    Boolean   @default(true)
  adminNotifyEmail        String?
}
```

### 2.4 Update API Key Admin UI

Add configuration options for:
- Enable autoresponder (checkbox)
- Select autoresponder template (dropdown)
- Enable admin notification (checkbox)
- Admin notification email (input)

---

## Phase 3: FutureFast.ai Form Integration

### 3.1 Create New Form Component

**New file**: `/components/DevenCRMForm.tsx`

Features:
- Same visual design as MailerLiteEmbed
- Client-side validation (email, phone)
- reCAPTCHA integration (existing)
- Submits to Deven CRM capture API
- Loading states and success/error handling
- Parallel submission to MailerLite (during transition)

**Form fields**:
| Field | Required | Maps to Deven CRM |
|-------|----------|-------------------|
| First Name | Yes | `firstName` |
| Last Name | Yes | `lastName` |
| Email | Yes | `primaryEmail` |
| Phone | No | `primaryPhone` |
| Comment | No | `metadata.comment` |

### 3.2 Create API Route for Dual Submission

**New file**: `/src/app/api/subscribe-v2/route.ts`

During parallel operation, this route:
1. Validates input server-side
2. Submits to Deven CRM `/api/v1/capture`
3. Submits to MailerLite (existing flow)
4. Returns combined success/failure status

```typescript
// Parallel submission logic
const [crmResult, mailerliteResult] = await Promise.allSettled([
  submitToDevenCRM(data),
  submitToMailerLite(data),
]);

// Log any discrepancies for monitoring
if (crmResult.status !== mailerliteResult.status) {
  console.warn('Submission discrepancy:', { crmResult, mailerliteResult });
}
```

### 3.3 Environment Variables

Add to FutureFast.ai `.env.local`:
```env
# Deven CRM Integration
DEVEN_CRM_API_URL=https://crm.deven.network/api/v1/capture
DEVEN_CRM_API_KEY=dk_proj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Feature flags
ENABLE_DEVEN_CRM_SUBMISSION=true
ENABLE_MAILERLITE_SUBMISSION=true  # Set false after transition
```

### 3.4 Update Form Components

**Option A**: Replace MailerLiteEmbed with DevenCRMForm
- Update `/components/AboutWithSubscription.tsx`
- Update `/components/SubscriptionSection.tsx`

**Option B**: Add feature flag to MailerLiteEmbed
- Keep existing component
- Add conditional submission logic
- Controlled by environment variable

**Recommended**: Option B for safer transition

---

## Phase 4: Testing & Validation

### 4.1 Pre-Launch Checklist

- [ ] FutureFast brand created in Deven CRM
- [ ] Welcome email template created and tested
- [ ] API key created with correct permissions
- [ ] Tags and group created
- [ ] Autoresponder Inngest function deployed
- [ ] Environment variables configured in FutureFast
- [ ] Form component updated with dual submission
- [ ] reCAPTCHA still functional

### 4.2 Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Valid submission | Contact created in both systems, welcome email sent |
| Duplicate email | Contact updated in Deven CRM, handled gracefully |
| Invalid email format | Client-side validation prevents submission |
| Missing required fields | Form shows validation errors |
| Deven CRM unavailable | MailerLite fallback works, error logged |
| MailerLite unavailable | Deven CRM works, error logged |
| Rate limit exceeded | Graceful error message to user |

### 4.3 Monitoring During Parallel Operation

Track daily:
- Submission counts in both systems
- Email delivery rates from both systems
- Error rates and types
- Admin notification delivery

**Dashboard query** (Deven CRM):
```sql
SELECT DATE(createdAt), COUNT(*)
FROM Contact
WHERE sourceProject = 'futurefast'
GROUP BY DATE(createdAt)
ORDER BY DATE(createdAt) DESC;
```

---

## Phase 5: MailerLite Sunset

### 5.1 Transition Criteria

Before disabling MailerLite:
- [ ] 2+ weeks of parallel operation without issues
- [ ] Email delivery rate from Deven CRM ≥ MailerLite
- [ ] All contacts synced to Deven CRM
- [ ] Welcome email engagement comparable
- [ ] No unresolved errors in logs

### 5.2 Sunset Steps

1. **Disable MailerLite submission**:
   ```env
   ENABLE_MAILERLITE_SUBMISSION=false
   ```

2. **Update form component** to remove MailerLite code

3. **Remove MailerLite webhook** handler (optional, keep for historical)

4. **Export MailerLite subscribers** for archive

5. **Update documentation** and remove MailerLite references

### 5.3 Rollback Plan

If issues arise after sunset:
1. Re-enable MailerLite submission immediately
2. Investigate Deven CRM issues
3. Fix and retest before next sunset attempt

---

## Implementation Checklist

### Deven CRM Changes

- [ ] Create FutureFast brand
- [ ] Create welcome email template
- [ ] Create API key with autoresponder config
- [ ] Create tags: `futurefast`, `website-signup`, `lead`
- [ ] Create group: `FutureFast Subscribers`
- [ ] Add `triggerAutoresponder` field to ProjectApiKey model
- [ ] Add `autoresponderTemplateId` field to ProjectApiKey model
- [ ] Create `contact/captured` Inngest event handler
- [ ] Update API key admin UI
- [ ] Run Prisma migration
- [ ] Deploy changes

### FutureFast Changes

- [ ] Add environment variables
- [ ] Create `/api/subscribe-v2` route (dual submission)
- [ ] Update MailerLiteEmbed or create DevenCRMForm
- [ ] Test form submission end-to-end
- [ ] Deploy to production

### Validation

- [ ] Submit test contact through form
- [ ] Verify contact appears in Deven CRM
- [ ] Verify contact appears in MailerLite
- [ ] Verify welcome email received
- [ ] Verify admin notification received
- [ ] Monitor for 2 weeks

### Sunset

- [ ] Disable MailerLite submission
- [ ] Remove legacy code
- [ ] Archive MailerLite data
- [ ] Update documentation

---

## Appendix A: Current MailerLite Configuration

**Account**:
- Account ID: `1595754`
- Form ID: `mlb2-27227712`

**Webhook URL**: `https://futurefast.ai/api/webhooks/mailerlite`

**Events handled**:
- `subscriber.created`
- `subscriber.added`
- `subscriber.updated`
- `subscriber.unsubscribed`
- `subscriber.bounced`
- `subscriber.complained`

**Action Required**: Export current welcome email content from MailerLite automation before creating Deven CRM template.

---

## Appendix B: Deven CRM Capture API Reference

**Endpoint**: `POST https://crm.deven.network/api/v1/capture`

**Headers**:
```
X-API-Key: dk_proj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

**Request Body**:
```json
{
  "primaryEmail": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "primaryPhone": "+1234567890",
  "organization": "Acme Corp",
  "title": "CEO",
  "metadata": {
    "comment": "User's comment from form",
    "form_page": "/subscribe",
    "referrer": "google"
  }
}
```

**Success Response** (201 Created / 200 Updated):
```json
{
  "success": true,
  "contactId": "clxxxxxxxxxxxxxxxxxx",
  "isNew": true,
  "message": "Contact created"
}
```

**Error Response** (400/401/429):
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Appendix C: Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Welcome emails not sending | Medium | High | Test thoroughly before launch; keep MailerLite as backup |
| Email deliverability issues | Low | High | Resend has strong deliverability; monitor bounce rates |
| API key exposure | Low | Medium | Server-side only; never in client code |
| Rate limiting triggered | Low | Low | Set generous limits; form has reCAPTCHA |
| Data sync discrepancies | Medium | Low | Parallel operation catches issues; reconcile daily |
| Template rendering errors | Medium | Medium | Thorough template testing; fallback to plain text |

---

## Appendix D: Future Enhancements

After successful integration, consider:

1. **Email sequences**: Multi-email nurture campaigns for new subscribers
2. **Engagement scoring**: Track opens/clicks to identify hot leads
3. **Segmentation**: Automatic grouping based on engagement
4. **A/B testing**: Test subject lines and content
5. **Analytics dashboard**: FutureFast-specific metrics in Deven CRM
6. **Re-engagement campaigns**: Automated campaigns for cold subscribers

---

*Plan created: January 14, 2026*
*Last updated: January 14, 2026*
