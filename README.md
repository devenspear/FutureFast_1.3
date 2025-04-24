# FutureFast Homepage

This project is a professional, animated, mobile-first homepage for FutureFast.com, built with Next.js, Tailwind CSS, and (future) Contentful CMS.

## Features
- **Hero Section:** Animated headline, subheadline, and background
- **Curated Library Cards:** Dynamic grid (Contentful integration planned)
- **Featured Insight:** Highlight section
- **Exponential Timeline:** Animated timeline
- **Subscribe:** Substack integration
- **About Me:** Bio, profile, quote, links
- **Footer:** Socials, copyright, badge
- **Mobile-first, dark mode**

## Tech Stack
- Next.js (App Router, TypeScript, v15+)
- Tailwind CSS (animations, dark mode)
- Contentful CMS (planned)

## Project Structure
```
FutureFast.1.1/
  components/
  lib/
  public/
  src/
    app/
      page.tsx
      layout.tsx
      globals.css
  package.json
  next.config.ts
  ...
```

## Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/devenspear/FutureFast.1.1.git
   cd FutureFast.1.1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## Vercel Deployment
- **Root Directory:** Leave blank (use repo root)
- **Framework Preset:** Next.js
- **Build Command:** (default) `next build`
- **Output Directory:** (default)
- **Install Command:** (default)

### Troubleshooting
- If you see a 404 after deploy:
  - Ensure your Vercel project is connected to the correct repo and branch.
  - The Root Directory must be blank (unless your Next.js project is in a subfolder).
  - Your `src/app/page.tsx` and `src/app/layout.tsx` must exist and be correctly named (case-sensitive).
  - If you restructure the repo, remove and re-add the project in Vercel.

## Contentful Integration (Planned)
- Add your Contentful credentials in `.env.local` when ready.

---

2025 Deven Spear | All Rights Reserved

This is a fork of Exponize2.3, now rebranded as FutureFast 1.1. All previous Exponize references have been updated.
