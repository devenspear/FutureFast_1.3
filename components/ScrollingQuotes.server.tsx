import React from 'react';
import { loadScrollingQuotes } from '../lib/content-loader';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const ScrollingQuotesClient = dynamic(() => import('./ScrollingQuotes.client'), { 
  ssr: true,
  loading: () => <section className="w-full bg-black py-8">Loading quotes...</section>
});

export default function ScrollingQuotesServer() {
  const quotes = loadScrollingQuotes();
  return <ScrollingQuotesClient quotes={quotes} />;
}
