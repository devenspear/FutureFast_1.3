import React from 'react';
import { loadHeroContent } from '../lib/content-loader';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const HeroSectionClient = dynamic(() => import('./HeroSection.client'), { ssr: true });

export default function HeroSectionServer() {
  const heroContent = loadHeroContent();
  return <HeroSectionClient content={heroContent} />;
}
