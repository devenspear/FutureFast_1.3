'use client';
import React from 'react';
import Carousel from './Carousel';
import type { Card as CMSCard } from './ResourceLibrarySection.server';
import type { ResourceCardProps } from './ResourceCard';

// Map CMSCard to ResourceCardProps
function mapCMSToResourceCard(card: CMSCard): ResourceCardProps {
  // Combine month and year if both exist
  let date = card.year;
  if (card.month && card.year) {
    date = `${card.month.charAt(0).toUpperCase() + card.month.slice(1)} ${card.year}`;
  }
  return {
    id: card.title,
    title: card.title,
    author: '',
    date,
    description: card.description,
    image: card.image || `https://placehold.co/600x400/0a192f/64ffda?text=${encodeURIComponent(card.title.substring(0, 20))}`,

    platform: card.type,
    url: card.url || '',
  };
}

export default function ResourceLibrarySectionClient({ cards }: { cards: CMSCard[] }) {
  // Sort cards by date (newest first)
  const sortedCards = [...cards].sort((a, b) => {
    // Parse the year (and month if available) to get a comparable date
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    
    if (yearA !== yearB) {
      return yearB - yearA; // Sort by year (descending)
    }
    
    // If years are equal, sort by month if available
    if (a.month && b.month) {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const monthIndexA = months.indexOf(a.month.toLowerCase());
      const monthIndexB = months.indexOf(b.month.toLowerCase());
      return monthIndexB - monthIndexA; // Sort by month (descending)
    }
    
    return 0;
  });
  
  const resourceCards: ResourceCardProps[] = sortedCards.map(mapCMSToResourceCard);
  return (
    <section className="py-12 md:py-16 bg-black text-white" id="resource-library">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Resource Library
          </h1>
          <p className="font-sans text-lg md:text-xl text-cyan-100 max-w-3xl mx-auto">
            Master exponential fluency.<br />
            Tap into a curated library of whitepapers, frameworks, field guides, and interactive explainers. Built for builders, thinkers, and the boldly curious.<br />
            The faster the change, the more vital the compass. Start here.
          </p>
        </div>
        <div className="relative">
          <Carousel cards={resourceCards} />
        </div>
      </div>
    </section>
  );
}
