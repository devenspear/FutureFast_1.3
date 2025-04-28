'use server';

import React from 'react';
import { loadScrollingQuotes } from '../lib/content-loader';
import ScrollingQuotesClient from './ScrollingQuotes.client';

export default async function QuotationsRibbonSection() {
  // Load quotes from Markdown file
  const quotes = await loadScrollingQuotes();
  
  return (
    <section className="w-full py-16 bg-black overflow-hidden relative">
      {/* Subtle gradient overlay instead of strong bands */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/20 to-blue-900/10 opacity-50"></div>
      <ScrollingQuotesClient quotes={quotes} />
    </section>
  );
}
