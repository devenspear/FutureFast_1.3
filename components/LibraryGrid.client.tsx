'use client';
import React, { useState } from 'react';
import ResourceCard from './ResourceCard';
import ResourceDetailModal from './ResourceDetailModal';
import type { Card } from './LibraryGrid.server';

export default function LibraryGridClient({ cards }: { cards: Card[] }) {
  const [selected, setSelected] = useState<Card | null>(null);
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" id="resource-library">
      <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
        Resource Library
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <ResourceCard key={idx} card={card} onClick={() => setSelected(card)} />
        ))}
      </div>
      <ResourceDetailModal card={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
