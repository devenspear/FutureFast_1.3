'use client';
import React from 'react';
import Carousel from './Carousel';
import type { Card as CMSCard } from './LibraryGrid.server';
import type { ResourceCardProps } from './ResourceCard';

// Map CMSCard to ResourceCardProps
function mapCMSToResourceCard(card: CMSCard): ResourceCardProps {
  return {
    id: card.title,
    title: card.title,
    author: '',
    date: card.year,
    description: card.description,
    image: card.image || '/images/default.jpg',
    overlayText: card.tag,
    duration: '',
    platform: card.type,
    url: card.url || '',
  };
}

export default function LibraryGridClient({ cards }: { cards: CMSCard[] }) {
  const resourceCards: ResourceCardProps[] = cards.map(mapCMSToResourceCard);
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" id="resource-library">
      <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Resource Library
      </h1>
      {/* Only show the new carousel, no black ribbon or 2x2 grid */}
      <div className="mb-12">
        <Carousel cards={resourceCards} />
      </div>
    </section>
  );
}
