import React, { useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ResourceCard from './ResourceCard';
import ResourceDetailModal from './ResourceDetailModal';

interface Card {
  title: string;
  description: string;
  year: string;
  type: string;
  tag: string;
  image?: string;
  body?: string;
  url?: string;
}

function getCards(): Card[] {
  const cardsDir = path.join(process.cwd(), 'content/catalog');
  if (!fs.existsSync(cardsDir)) return [];
  return fs.readdirSync(cardsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(cardsDir, file);
      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
      return {
        ...data,
        body: content,
      } as Card;
    });
}

export default function LibraryGrid() {
  const cards = getCards();
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
