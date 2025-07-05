# VercelWebFramework 1.0 - Template Setup Guide

## 🎯 Overview

This guide will help you transform the VercelWebFramework template into your own custom website. Follow these steps to customize branding, content, and integrations.

## 📋 Pre-Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Git repository created
- [ ] Vercel account (for deployment)
- [ ] API keys for desired integrations

## 🚀 Phase 1: Basic Project Setup

### 1.1 Project Initialization

```bash
# Clone the template
git clone <your-template-repo>
cd VercelWebFramework1.0

# Install dependencies
npm install

# Copy environment template
cp env.sample .env.local
```

### 1.2 Core Configuration

Update these files with your project details:

#### package.json
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "Your project description"
}
```

#### src/app/layout.tsx
```typescript
// Update metadata
export const metadata: Metadata = {
  title: 'Your Site Name',
  description: 'Your site description',
  keywords: ['your', 'keywords'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Your Site Name',
    description: 'Your site description',
    url: 'https://yoursite.com',
    siteName: 'Your Site Name',
    images: [
      {
        url: '/your-og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
}
```

#### src/app/page.tsx
```typescript
// Update page title and description
export const metadata: Metadata = {
  title: 'Your Homepage Title',
  description: 'Your homepage description',
}
```

### 1.3 Branding Customization

#### Colors and Styling
Update `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-primary-50',
          500: '#your-primary-500',
          900: '#your-primary-900',
        },
        secondary: {
          50: '#your-secondary-50',
          500: '#your-secondary-500',
          900: '#your-secondary-900',
        },
      },
    },
  },
}
```

#### Favicon and Images
Replace files in `/public/`:
- `favicon.ico` - Your favicon
- `favicon.svg` - SVG version
- `social-share.png` - Social media image
- `images/` - Your brand images

## 🎨 Phase 2: Content Customization

### 2.1 Hero Section

Update `content/sections/hero.md`:
```yaml
---
title: "Your Hero Title"
subtitle: "Your Hero Subtitle"
description: "Your hero description"
cta_text: "Get Started"
cta_link: "/contact"
background_image: "/your-hero-bg.jpg"
---
```

### 2.2 About Section

Update `content/sections/about.md`:
```yaml
---
title: "About Us"
description: "Your company description"
bio: "Your personal or company bio"
quote: "Your inspiring quote"
quote_author: "Quote Author"
social_links:
  twitter: "https://twitter.com/yourhandle"
  linkedin: "https://linkedin.com/in/yourprofile"
  github: "https://github.com/yourusername"
---
```

### 2.3 News Content

Replace content in `/content/news/`:
```markdown
---
title: "Your News Title"
source: "News Source"
date: "2025-01-15"
url: "https://source.com/article"
icon: "📰"
featured: false
excerpt: "News excerpt"
---
```

### 2.4 Resources

Update `/content/catalog/` with your resources:
```markdown
---
title: "Your Resource"
description: "Resource description"
category: "Your Category"
difficulty: "Beginner|Intermediate|Advanced"
url: "https://resource-url.com"
image: "/resource-image.jpg"
featured: true
---
```

## 🔧 Phase 3: Integration Setup

### 3.1 Required Integrations

#### Admin Authentication
```bash
# Add to .env.local
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

#### Base URL Configuration
```bash
# Add to .env.local
NEXT_PUBLIC_BASE_URL=https://yoursite.com
```

### 3.2 Optional Integrations

#### YouTube Integration
1. Get API key from [Google Console](https://console.developers.google.com/)
2. Enable YouTube Data API v3
3. Add to `.env.local`:
```bash
YOUTUBE_API_KEY=your_youtube_api_key
```

#### Notion Integration
1. Create integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. Create database with required properties
3. Add to `.env.local`:
```bash
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_database_id
```

#### MailerLite Integration
1. Get API key from [MailerLite](https://app.mailerlite.com/integrations/api)
2. Create subscription form
3. Add to `.env.local`:
```bash
MAILERLITE_API_KEY=your_api_key
MAILERLITE_ACCOUNT_ID=your_account_id
MAILERLITE_FORM_ID=your_form_id
```

#### OpenAI Integration
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env.local`:
```bash
OPENAI_API_KEY=your_openai_key
```

#### Vercel Blob Storage
1. Create blob store in Vercel dashboard
2. Add to `.env.local`:
```bash
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## 🎯 Phase 4: Component Customization

### 4.1 Hero Section Component

Update `components/HeroSection.tsx`:
```typescript
// Customize animations, colors, and content
const heroConfig = {
  title: "Your Custom Title",
  subtitle: "Your Custom Subtitle",
  backgroundColor: "your-bg-color",
  textColor: "your-text-color",
  animationSpeed: 1.0, // Adjust animation speed
}
```

### 4.2 Navigation and Footer

Update `components/Footer.tsx`:
```typescript
const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
]

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/yourhandle' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/yourprofile' },
]
```

### 4.3 Admin Dashboard

Customize admin components in `src/app/admin/`:
- Update branding in `AdminNavbar.tsx`
- Customize dashboard sections
- Add your logo and colors

## 🚀 Phase 5: Deployment Setup

### 5.1 Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Configure custom domain

### 5.2 Environment Variables in Production

Add all your `.env.local` variables to Vercel:
- Go to Project Settings → Environment Variables
- Add each variable with appropriate environment (Production/Preview/Development)

### 5.3 Domain Configuration

1. Add custom domain in Vercel dashboard
2. Configure DNS records
3. Update `NEXT_PUBLIC_BASE_URL` to your domain

## 🔒 Phase 6: Security Configuration

### 6.1 Form Security

#### Cloudflare Turnstile
1. Create account at [Cloudflare](https://dash.cloudflare.com/)
2. Add site and get keys
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

#### reCAPTCHA (Alternative)
1. Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Add to `.env.local`:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### 6.2 Admin Security

Update admin credentials:
```bash
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_very_secure_password
```

## 📊 Phase 7: Analytics Setup

### 7.1 Google Analytics

1. Create GA4 property
2. Get measurement ID
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 7.2 Google Search Console

1. Add site to Search Console
2. Get verification code
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code
```

## 🧪 Phase 8: Testing

### 8.1 Local Testing

```bash
# Start development server
npm run dev

# Test all pages
curl http://localhost:3000
curl http://localhost:3000/admin
curl http://localhost:3000/api/news
```

### 8.2 Integration Testing

Test each integration:
- YouTube API: Check `/admin/youtube`
- Notion: Check `/notion-news-test`
- MailerLite: Test subscription form
- Admin: Test login at `/admin`

### 8.3 Performance Testing

```bash
# Build and test
npm run build
npm run start

# Check bundle size
npm run build -- --analyze
```

## 🔄 Phase 9: Maintenance Setup

### 9.1 Monitoring

Set up monitoring for:
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Security scanning

### 9.2 Backup Strategy

Configure backups for:
- Database (if using)
- Content files
- Environment variables
- User data

### 9.3 Update Strategy

Plan for:
- Dependency updates
- Security patches
- Feature additions
- Content updates

## 🆘 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables
- Check all required variables are set
- Verify variable names match exactly
- Restart development server after changes

#### API Integration Issues
- Verify API keys are correct
- Check API quotas and limits
- Test API endpoints directly
- Review error logs

#### Styling Issues
- Check Tailwind CSS compilation
- Verify custom CSS imports
- Test responsive breakpoints
- Clear browser cache

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Integration Guides](docs/)

## ✅ Final Checklist

- [ ] All branding updated
- [ ] Content customized
- [ ] Integrations configured
- [ ] Security measures in place
- [ ] Analytics tracking setup
- [ ] Performance optimized
- [ ] Testing completed
- [ ] Deployment successful
- [ ] Monitoring configured
- [ ] Documentation updated

---

**🎉 Congratulations! Your VercelWebFramework site is ready to launch!** 