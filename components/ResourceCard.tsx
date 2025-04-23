import React from "react";

export default function ResourceCard({ card, onClick }: { card: any, onClick: () => void }) {
  return (
    <div
      className="bg-gray-900 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-2xl hover:ring-2 hover:ring-cyan-400 transition"
      onClick={onClick}
      tabIndex={0}
      onKeyPress={e => { if (e.key === 'Enter') onClick(); }}
      role="button"
      aria-label={`Open details for ${card.title}`}
    >
      <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
      <span className="inline-block bg-purple-800 text-purple-100 px-3 py-1 rounded text-xs font-semibold mb-2">
        {card.tag}
      </span>
      <div className="text-gray-400 text-sm mb-1">
        {card.year} • {card.type}
      </div>
      <p className="text-gray-300 mb-4">{card.description}</p>
      {card.image && (
        <img src={card.image} alt={card.title} className="w-full rounded-lg mb-2" />
      )}
    </div>
  );
}
