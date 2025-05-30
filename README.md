# FutureFast Homepage

This project is a professional, animated, mobile-first homepage for FutureFast.com, built with Next.js 15.3.0, Tailwind CSS, and modern web technologies.

## Features

### ✨ **Current Features**
- **🎯 Hero Section:** Physics-based animated bubbles with diameter-controlled movement, dynamic content loading, and text collision avoidance
- **📚 Learning Resources:** Curated educational resources (AI, Crypto, Blockchain) with provider icons and difficulty indicators
- **📺 YouTube Channels:** Dynamic video grid with fallback data and mobile optimization
- **📰 News & Disruption:** Latest industry updates and insights
- **🏎️ Fast Lane Section:** Speed-focused content and statistics
- **💡 Thought Leaders:** Industry expert highlights
- **✉️ Newsletter Subscription:** Secure form with Vercel Blob Storage integration
- **👨‍💼 About Section:** Bio, profile, quote, and social links
- **🎨 Custom Favicon:** Blue/gold gradient design with lightning bolt
- **📱 Mobile-first responsive design with advanced animations**

### 🎬 **Animation System**
- **Diameter-Based Speed Control:** Bubbles move at maximum of their diameter per second
- **Physics-Based Movement:** Realistic collision detection and boundary behavior
- **Text Avoidance:** Dynamic repulsion forces prevent overlap with content
- **Unique Path Memory:** Anti-repetition system ensures varied movement patterns
- **60fps Performance:** Hardware-accelerated RequestAnimationFrame animations

## Tech Stack
- **Frontend:** Next.js 15.3.0 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom animations
- **Icons:** React Icons (FontAwesome, Simple Icons)
- **Fonts:** Google Fonts (Orbitron, Geist)
- **Storage:** Vercel Blob Storage (newsletter subscriptions)
- **Analytics:** Google Analytics integration
- **Deployment:** Vercel with optimized build configuration

## Project Structure
```
FutureFast.1.2/
├── components/
│   ├── HeroSection.tsx           # Physics-based animated hero
│   ├── LearningResourcesSection.tsx # Educational resources
│   ├── YouTubeChannelsSection.tsx
│   ├── NewsAndDisruptionSection.tsx
│   ├── FastLaneSection.tsx
│   ├── ThoughtLeadersSection.tsx
│   ├── AboutWithSubscription.tsx
│   └── Footer.tsx
├── lib/
│   ├── analytics.ts              # Event tracking utilities
│   └── content-loader.ts         # Dynamic content loading
├── public/
│   ├── favicon.svg               # Custom FutureFast favicon
│   ├── favicon-16.svg            # Optimized small size
│   └── favicon.ico               # Browser fallback
├── src/
│   └── app/
│       ├── page.tsx              # Main homepage
│       ├── layout.tsx            # Global layout & metadata
│       ├── globals.css           # Global styles
│       └── api/                  # API routes
└── styles/                       # Additional CSS modules
```

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/devenspear/FutureFast_1.2.git
   cd FutureFast.1.2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp env.sample .env.local
   # Edit .env.local with your configuration:
   # - BLOB_READ_WRITE_TOKEN (Vercel Blob Storage)
   # - ADMIN_USERNAME & ADMIN_PASSWORD
   # - NEXT_PUBLIC_GOOGLE_VERIFICATION
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)
- **Framework:** Next.js
- **Build Command:** `next build`
- **Output Directory:** (default)
- **Node.js Version:** 18.x

### Environment Variables
Required for production:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage access
- `ADMIN_USERNAME` - Admin dashboard access
- `ADMIN_PASSWORD` - Admin dashboard access  
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Google Search Console

## Contact Form CRM Integration

The "Join Our Mailing List" form in the `AboutWithSubscription.tsx` component has been updated to integrate with a new CRM backend and Cloudflare Turnstile for spam protection.

### Integration Details:
- **CRM API Endpoint:** `https://crm.deven.site/api/submissions`
- **Cloudflare Turnstile Site Key:** `0x4AAAAAABerS3z0dQ0loAUa` (used in `AboutWithSubscription.tsx`)
- **Cloudflare Turnstile Secret Key:** Configured in the backend CRM project (`dev-co-crm`) on Vercel. This key must correspond to the Site Key above.

### Implementation Overview:
The `handleSubmit` function within `components/AboutWithSubscription.tsx` was modified to:
1.  Collect form data (First Name, Last Name, Email, Company).
2.  Dynamically load and render the Cloudflare Turnstile widget.
3.  Capture the Turnstile token (`cf-turnstile-response`).
4.  Send a POST request to the CRM API endpoint (`https://crm.deven.site/api/submissions`) with the form data and the Turnstile token.
5.  The request includes an `X-API-Key` header for authentication with the CRM.
6.  The form submission is blocked if the Turnstile token is not obtained.

The `Turnstile` interface was added, and the global `Window` type was augmented to prevent TypeScript errors related to `window.turnstile`.

## Recent Updates (v1.2)

### 🎯 **Physics-Based Animations**
- Implemented diameter-based speed control for hero bubbles
- Reduced bubble count by 50% for better performance
- Enhanced collision detection and text avoidance
- Maintained randomness while respecting physics constraints

### 📚 **Learning Resources Section**
- Added 7 curated educational resources
- Category-based color coding (AI, Crypto, Blockchain)
- Provider icons and difficulty indicators
- External link tracking with analytics

### 🎨 **Visual Improvements**
- Custom FutureFast favicon with brand colors
- Multiple favicon formats for browser compatibility
- Enhanced mobile touch optimizations
- Improved typography and spacing consistency

## Performance Features
- **Static Generation:** Pre-rendered pages for optimal loading
- **Image Optimization:** Next.js automatic image optimization
- **Font Loading:** Optimized Google Fonts with display: swap
- **Bundle Splitting:** Automatic code splitting for smaller bundles
- **Hardware Acceleration:** GPU-accelerated animations where supported

## Content Management
Content is managed through a hybrid approach:
- **Static Content:** Hero, About, Footer sections use markdown files
- **Dynamic Content:** API routes for YouTube videos and news
- **Component State:** Interactive sections with client-side libraries

### News Articles
News articles are managed as individual Markdown (`.md`) files located in the `/content/news/` directory. Each file represents a single news item and should include the following frontmatter:

-   `title`: (String, required) The headline of the news article.
-   `source`: (String, required) The original source of the news (e.g., "TechCrunch", "Forbes").
-   `date`: (String, required) The publication date of the article. Can be in a human-readable format (e.g., "April 22, 2025") or ISO 8601 format (e.g., "2025-04-22"). The system will parse these dates for sorting.
-   `url`: (String, required) The direct URL to the original news article.
-   `icon`: (String, optional) An emoji or short character to represent the article type or source (e.g., "📸", "✨"). Defaults to "🔍" if not provided by the API.
-   `featured`: (Boolean, optional) Set to `true` if the article should be considered for featured display (specific usage depends on component implementation). Defaults to `false`.
-   `excerpt`: (String, optional) A short summary or excerpt of the article, which might be used in some display formats.

The website automatically fetches these articles from the `/content/news/` directory via the `/api/news` endpoint and sorts them by date in descending order (newest first) for display in the "In The News" section.

## Security Features
- **Input Validation:** Server-side form validation
- **Rate Limiting:** Protection against spam submissions
- **Environment Protection:** Sensitive data in environment variables
- **Admin Authentication:** Secure admin dashboard access


## Development & Debugging Notes

### Admin Authentication Issues (Session: 2025-05-29)
An attempt was made to debug issues with the admin authentication flow, specifically 401 errors when accessing the `/api/admin/news/submit` endpoint after login.
Detailed notes on the findings, changes made, and current status of this debugging effort can be found in `AUTH_DEBUG_NOTES.md`.
This issue is currently on hold.

---

**2025 Deven Spear | All Rights Reserved**

*FutureFast 1.2 - Empowering Speed with Physics-Based Animations*
