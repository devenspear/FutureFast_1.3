import React from "react";
import type { Card } from './LibraryGrid.server';

export default function ResourceDetailModal({ card, onClose }: { card: Card|null, onClose: () => void }) {
  if (!card) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-br from-blue-700/95 to-yellow-200/90 border border-blue-400 rounded-2xl shadow-2xl p-0 max-w-3xl w-full max-h-[90vh] h-auto flex flex-row overflow-hidden relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-yellow-400 hover:bg-blue-700 text-blue-900 hover:text-yellow-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg transition-all"
          aria-label="Close"
        >
          ×
        </button>
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col justify-between p-8 min-w-0">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-blue-700 bg-clip-text text-transparent">{card.title}</h2>
            <div className="text-yellow-200 text-lg font-semibold mb-2 flex flex-wrap gap-2 items-center">
              <span>{card.year}</span>
              {card.month && <span>{card.month}</span>}
              <span>• {card.type}</span>
              <span className="bg-yellow-800 text-yellow-100 px-2 py-1 rounded">{card.tag}</span>
            </div>
            <div className="text-blue-200 mb-4 line-clamp-3">{card.description}</div>
            {/* Main body/content */}
            {card.body && (
              <div className="prose prose-invert max-w-none text-yellow-100 mb-4 max-h-32 overflow-y-auto">
                {card.body}
              </div>
            )}
          </div>
          {/* Summary at bottom left */}
          {card.summary && (
            <div className="mt-4 text-sm text-blue-200 bg-blue-800/70 rounded-lg p-4 border border-blue-700">
              <strong>Summary:</strong> {card.summary}
            </div>
          )}
          {/* Source link */}
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-2 bg-blue-700 hover:bg-yellow-400 hover:text-blue-900 rounded-full text-white font-bold text-lg shadow transition-all"
            >
              Read Original Source
            </a>
          )}
        </div>
        {/* Right: Image Panel */}
        {card.image && (
          <div className="flex-shrink-0 flex items-center justify-center bg-blue-900 h-full p-4 max-w-xs w-[320px] border-l border-yellow-400 relative">
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
