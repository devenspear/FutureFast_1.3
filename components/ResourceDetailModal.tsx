import React from "react";
import type { Card } from './LibraryGrid.server';

export default function ResourceDetailModal({ card, onClose }: { card: Card|null, onClose: () => void }) {
  if (!card) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/90 border border-cyan-400 rounded-2xl shadow-2xl p-0 max-w-3xl w-full max-h-[90vh] h-auto flex flex-row overflow-hidden relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold rounded-lg shadow hover:scale-105 transition border-2 border-cyan-400 z-20"
          aria-label="Close"
          style={{ boxSizing: 'border-box' }}
        >
          <span className="text-2xl leading-none">×</span>
        </button>
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col justify-between p-8 min-w-0">
          <div>
            <h2 className="text-3xl font-bold text-cyan-300 mb-2 break-words">{card.title}</h2>
            <div className="text-gray-400 text-sm mb-2 flex flex-wrap gap-2 items-center">
              <span>{card.year}</span>
              {card.month && <span>{card.month}</span>}
              <span>• {card.type}</span>
              <span className="bg-purple-800 text-purple-100 px-2 py-1 rounded">{card.tag}</span>
            </div>
            <div className="text-gray-300 mb-4 line-clamp-3">{card.description}</div>
            {/* Main body/content */}
            {card.body && (
              <div className="prose prose-invert text-purple-100 mb-4 max-h-32 overflow-y-auto">
                {card.body}
              </div>
            )}
          </div>
          {/* Summary at bottom left */}
          {card.summary && (
            <div className="mt-4 text-sm text-gray-200 bg-gray-800/70 rounded-lg p-4 border border-gray-700">
              <strong>Summary:</strong> {card.summary}
            </div>
          )}
          {/* Source link */}
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold rounded-lg shadow hover:scale-105 transition"
            >
              Read Original Source
            </a>
          )}
        </div>
        {/* Right: Image Panel */}
        {card.image && (
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-900 h-full p-4 max-w-xs w-[320px] border-l border-cyan-900 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.title}
              className="object-cover rounded-xl shadow max-h-[60vh] w-full aspect-[4/5]"
              style={{ maxWidth: 280 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
