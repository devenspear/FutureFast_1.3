import React from 'react';
import { loadHeroContent } from '../lib/content-loader';
import dynamic from 'next/dynamic';

// Define the HeroContent type here to avoid circular dependencies
export interface HeroContent {
  headline: string;
  subheadline: string;
}

// Use dynamic import with no SSR to avoid hydration issues
const HeroSectionClient = dynamic(() => import('./HeroSection.client'), { 
  ssr: true,
  loading: () => <div className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[85vh] w-full overflow-hidden bg-black">Loading...</div>
});

export default async function HeroSectionServer() {
  const heroContent = await loadHeroContent();
  return <HeroSectionClient content={{
    headline: String(heroContent.headline || ''),
    subheadline: String(heroContent.subheadline || '')
  }} />;
}
