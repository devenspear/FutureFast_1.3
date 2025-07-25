'use client';
import React from 'react';
import Carousel from './Carousel';
import type { Card as CMSCard } from './LibraryGrid.server';
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
    overlayText: card.tag,
    platform: card.type,
    url: card.url || '',
  };
}

export default function LibraryGridClient({ cards }: { cards: CMSCard[] }) {
  const resourceCards: ResourceCardProps[] = cards.map(mapCMSToResourceCard);
  return (
    <section className="py-12 md:py-16 bg-black text-white" id="resource-library">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Resource Library
          </h1>
          <p className="font-sans text-lg md:text-xl text-cyan-100 max-w-3xl mx-auto">
            Explore a curated collection of essential guides, articles, and courses. Build your foundational knowledge and master new skills at your own pace.
          </p>
        </div>
        <div className="relative">
          <Carousel cards={resourceCards} />
        </div>
      </div>
    </section>
  );
}
