import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';

interface Card {
  title: string;
  description: string;
  year: string;
  type: string;
  tag: string;
  image?: string;
  body?: string;
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
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" id="resource-library">
      <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
        Resource Library
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="text-xs font-bold uppercase mb-1 text-purple-300">
                {card.tag}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
              <div className="text-gray-400 text-sm mb-1">
                {card.year} • {card.type}
              </div>
              <p className="text-gray-300 mb-4">{card.description}</p>
              {card.image && (
                <img src={card.image} alt={card.title} className="w-full rounded-lg mb-2" />
              )}
            </div>
            {card.body && <div className="text-gray-400 text-xs mt-2">{card.body.substring(0, 120)}...</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
