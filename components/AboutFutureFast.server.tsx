import React from 'react';
import { loadAboutContent } from '../lib/content-loader';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const AboutFutureFastClient = dynamic(() => import('./AboutFutureFast.client'), { 
  ssr: true,
  loading: () => <div className="w-full py-20 bg-black text-white">Loading...</div>
});

export default async function AboutFutureFastServer() {
  const aboutContent = await loadAboutContent();
  return <AboutFutureFastClient content={{
    headline: String(aboutContent.headline || ''),
    subheadline: String(aboutContent.subheadline || '')
  }} />;
}
