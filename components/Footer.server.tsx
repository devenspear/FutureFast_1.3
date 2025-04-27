import React from 'react';
import { loadSiteSettings } from '../lib/content-loader';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const FooterClient = dynamic(() => import('./Footer.client'), { 
  ssr: true,
  loading: () => <footer className="bg-black py-8 text-gray-400 text-center border-t border-gray-800">Loading...</footer>
});

export default function FooterServer() {
  const siteSettings = loadSiteSettings();
  return <FooterClient settings={siteSettings} />;
}
