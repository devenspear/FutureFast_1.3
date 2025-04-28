'use server';

import React from 'react';
import { loadScrollingQuotes } from '../lib/content-loader';
import ScrollingQuotesClient from './ScrollingQuotes.client';

export default async function QuotationsRibbonSection() {
  // Load quotes from Markdown file
  const quotes = await loadScrollingQuotes();
  
  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 overflow-hidden">
      <ScrollingQuotesClient quotes={quotes} />
    </section>
  );
}
