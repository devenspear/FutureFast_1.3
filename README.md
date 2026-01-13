# VercelWebFramework 1.0

A comprehensive Next.js web framework template with content management, admin dashboard, and third-party integrations.

## 🚀 Features

### Core Framework
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Server & Client Components** architecture
- **Responsive Design** out of the box

### Content Management
- **Notion Integration** - Use Notion as your CMS
- **AI Content Extraction** - Automatically extract metadata from URLs
- **File-based Content** - Markdown support for static content
- **YouTube Integration** - Manage and display video content
- **Automated Workflows** - Process content via email or API

### Admin Dashboard
- **Secure Authentication** - Custom admin login system
- **Content Management** - Add/edit news, resources, videos
- **YouTube Management** - Add and manage YouTube videos
- **User Management** - Manage subscribers and users
- **Analytics Dashboard** - View site statistics

### Third-Party Integrations
- **MailerLite** - Email subscription forms
- **OpenAI** - AI-powered content generation
- **YouTube API** - Video content management
- **GitHub** - Auto-commit content changes
- **Vercel Blob Storage** - File uploads and storage
- **Vercel Postgres** - Database integration

### Security & Performance
- **Cloudflare Turnstile** - Bot protection
- **reCAPTCHA** - Form security
- **Rate Limiting** - API protection
- **Caching** - Optimized performance
- **SEO Optimized** - Meta tags and sitemaps

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Vercel account (for deployment)

## 🛠 Quick Start

### 1. Clone the Template
```bash
git clone <your-template-repo>
cd VercelWebFramework1.0
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp env.sample .env.local
# Edit .env.local with your configuration
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your site.

## ⚙️ Configuration

### Required Setup

1. **Environment Variables**
   - Copy `env.sample` to `.env.local`
   - Configure at least the core settings
   - Add API keys for integrations you want to use

2. **Project Customization**
   - Update `package.json` with your project name
   - Modify `src/app/layout.tsx` for your branding
   - Update content in `/content/` directories

3. **Deployment**
   - Connect to Vercel for deployment
   - Add environment variables to Vercel dashboard
   - Configure custom domain if needed

### Optional Integrations

#### YouTube Integration
1. Get YouTube API key from [Google Console](https://console.developers.google.com/)
2. Add `YOUTUBE_API_KEY` to `.env.local`
3. Access admin dashboard at `/admin/youtube`

#### Notion Integration
1. Create Notion integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. Create database with required properties
3. Add `NOTION_TOKEN` and `NOTION_DATABASE_ID` to `.env.local`
4. Follow setup guide in `docs/notion-integration-setup.md`

#### MailerLite Integration
1. Get API key from [MailerLite](https://app.mailerlite.com/integrations/api)
2. Create subscription form
3. Add MailerLite variables to `.env.local`
4. Follow setup guide in `docs/mailerlite-integration-guide.md`

#### OpenAI Integration
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add `OPENAI_API_KEY` to `.env.local`
3. AI features will be automatically enabled

## 📁 Project Structure

```
VercelWebFramework1.0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript types
├── content/                   # Content files
│   ├── news/                  # News articles
│   ├── catalog/               # Resources and reports
│   ├── sections/              # Page sections
│   └── youtube/               # Video content
├── public/                    # Static assets
├── docs/                      # Documentation
├── scripts/                   # Setup and utility scripts
│   ├── check-missing-videos.js  # Check for missing video files
│   ├── create-missing-videos.js # Create template files for missing videos
│   └── template-init.js      # Initialize new project template
└── lib/                       # Core library functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run dev:network` - Start dev server accessible on network
- `npm run lint` - Run ESLint
- `npm run setup` - Run setup wizard
- `npm run template:init` - Initialize new project

### 📺 YouTube Video Management Scripts

- `node scripts/check-missing-videos.js` - Check for missing video files
- `node scripts/create-missing-videos.js` - Create template files for missing videos

## 📚 Documentation

### Setup Guides
- [Notion Integration Setup](docs/notion-integration-setup.md)
- [MailerLite Integration Guide](docs/mailerlite-integration-guide.md)
- [YouTube API Setup](docs/YOUTUBE_API_SETUP.md)
- [AI Content Extraction](docs/AI_CONTENT_EXTRACTION_GUIDE.md)

### Architecture Guides
- [Content Management](docs/CONTENT_MANAGEMENT.md)
- [Automated Workflow Setup](docs/AUTOMATED_WORKFLOW_SETUP.md)
- [Performance Optimization](docs/performance-optimization-report.md)

### Admin Guides
- [Admin Dashboard](docs/ADMIN-README.md)
- [Security Considerations](docs/ADMIN_SECURITY.md)
- [Production YouTube Workflow](docs/PRODUCTION_YOUTUBE_WORKFLOW.md)
- [Notification Setup](docs/NOTIFICATION_SETUP.md)

### 🎯 New Features & Workflows

#### Alert Notification Center
- **Real-time system health monitoring** with automated alerts
- **Integrated into admin dashboard** under "Alerts & Monitoring" tab
- **Notion workflow processing status** with failure detection
- **Manual processing triggers** and health check capabilities

#### YouTube Video Management
- **Development**: Full file operations with automatic metadata fetching
- **Production**: Graceful handling with manual processing workflow
- **Admin Panel Integration**: Add videos via secure admin interface
- **File Validation**: Automatic detection and creation of missing video files

#### Enhanced Authentication System
- **Cookie-based session management** for seamless admin API access
- **Dual authentication support**: Basic Auth + session cookies
- **Production-ready security** with proper credential handling

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Use `netlify.toml` configuration
- **Railway**: Add environment variables
- **DigitalOcean**: Use Docker configuration

### 🔧 Deployment Troubleshooting

#### Domain Configuration Issues
If changes aren't reflected on your live site:

1. **Check domain assignment**:
   ```bash
   vercel domains inspect yourdomain.com
   vercel ls  # Get latest deployment URL
   ```

2. **Reassign domain to latest deployment**:
   ```bash
   vercel alias [latest-deployment-url] yourdomain.com
   vercel alias [latest-deployment-url] www.yourdomain.com
   ```

3. **Force fresh deployment**:
   ```bash
   # Make a small change and push
   git commit --allow-empty -m "Force deployment"
   git push origin main
   
   # Or manually deploy
   vercel --prod
   ```

#### Video Management Issues
If videos aren't appearing after admin panel submission:

1. **Check for missing video files**:
   ```bash
   node scripts/check-missing-videos.js
   ```

2. **Create missing video files**:
   ```bash
   node scripts/create-missing-videos.js
   ```

3. **Commit and deploy**:
   ```bash
   git add .
   git commit -m "Add missing video files"
   git push origin main
   ```

## 🔒 Security

- All API keys are server-side only
- Environment variables for sensitive data
- Rate limiting on API endpoints
- CSRF protection on forms
- Secure admin authentication

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This template is licensed under the MIT License.

## 🆘 Support

- Check the [documentation](docs/) first
- Review [troubleshooting guides](docs/)
- Open an issue for bugs
- Contact for custom development

## 🔄 Updates

To update the framework:
1. Check for new releases
2. Review changelog
3. Test in development
4. Update dependencies
5. Deploy to production

## 📈 Recent Enhancements (January 2026)

### YouTube Video Management
- **Database-backed storage** using PostgreSQL for all video data
- **YouTube Live URL support** - Added `/live/` URL pattern recognition
- **Auto-metadata fetching** via YouTube Data API v3
- **Admin panel integration** at `/admin` with full CRUD operations
- **Client-side caching** (30 minutes) for optimal performance

### Weekly Intelligence Digest
- **Disruption Radar integration** for AI-synthesized briefings
- **Enhanced layout** - Prominent date display, balanced card layout
- **Companies card** in left column, Technologies full-width in right
- **1-hour client-side cache** for briefing data

### Resource Library
- **File-based catalog** in `/content/catalog/` with markdown frontmatter
- **Thumbnail support** via `/public/uploads/`
- **Latest additions:** Deloitte Tech Trends 2026, Reimagining Tech Services for Agentic AI

### Previous Enhancements (August 2025)

#### Alert Notification Center
- **Real-time monitoring** of Notion workflow processing
- **Automated health checks** with email notifications
- **Admin dashboard integration** for centralized system oversight

#### Enhanced Authentication
- **Seamless admin experience** with cookie-based sessions
- **Production-ready security** with multiple auth methods
- **Rate limiting** on login attempts (5 attempts, 15-min lockout)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

<!-- Force deployment: 2025-08-21 19:35 -->
