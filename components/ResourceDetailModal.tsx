import React from "react";
import type { Card } from './LibraryGrid.server';

export default function ResourceDetailModal({ card, onClose }: { card: Card|null, onClose: () => void }) {
  if (!card) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 border border-cyan-400 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400 hover:text-pink-400 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        {card.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.image} alt={card.title} className="w-full rounded-xl mb-4 shadow" />
        )}
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">{card.title}</h2>
        <div className="text-gray-400 text-sm mb-2">{card.year} • {card.type} • <span className="bg-purple-800 text-purple-100 px-2 py-1 rounded">{card.tag}</span></div>
        <div className="prose prose-invert text-purple-100 mb-4" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
          {card.body}
        </div>
        {card.url && (
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold rounded-lg shadow hover:scale-105 transition"
          >
            Read Original Source
          </a>
        )}
      </div>
    </div>
  );
}
