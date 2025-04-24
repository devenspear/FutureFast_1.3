import React from "react";
import type { Card } from './LibraryGrid.server';

interface ResourceCardProps {
  card: Card;
  onClick: () => void;
  orientation?: 'portrait' | 'landscape';
}

export default function ResourceCard({ card, onClick, orientation = 'portrait' }: ResourceCardProps) {
  return (
    <div
      className={`bg-gray-900 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-2xl hover:ring-2 hover:ring-cyan-400 transition flex ${orientation === 'landscape' ? 'flex-row items-center gap-6' : 'flex-col'} `}
      onClick={onClick}
      tabIndex={0}
      onKeyPress={e => { if (e.key === 'Enter') onClick(); }}
      role="button"
      aria-label={`Open details for ${card.title}`}
      style={{ minHeight: orientation === 'landscape' ? 220 : undefined }}
    >
      {card.image && (
        <img
          src={card.image}
          alt={card.title}
          className={`rounded-lg mb-2 ${orientation === 'landscape' ? 'w-40 h-28 object-cover flex-shrink-0' : 'w-full'} `}
          style={orientation === 'landscape' ? { maxWidth: 180, minWidth: 120 } : {}}
        />
      )}
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
        <span className="inline-block bg-purple-800 text-purple-100 px-3 py-1 rounded text-xs font-semibold mb-2">
          {card.tag}
        </span>
        <div className="text-gray-400 text-sm mb-1">
          {card.year} • {card.type}
        </div>
        <p className="text-gray-300 mb-4">{card.description}</p>
      </div>
    </div>
  );
}
