import React from 'react';

export default function LibraryGrid() {
  // TODO: Fetch from Contentful, add filters, animate on hover
  return (
    <section className="py-16 bg-gray-950" id="library">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Curated Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {[1,2,3].map((item) => (
          <div
            key={item}
            className="bg-gray-900 rounded-xl p-6 shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-purple-800 hover:to-indigo-900 transition-all cursor-pointer"
          >
            <div className="text-sm text-purple-300 font-semibold mb-2">AI</div>
            <div className="text-xl text-white font-bold mb-1">Sample Resource Title</div>
            <div className="text-gray-400 text-sm mb-2">2025 • Article</div>
            <div className="text-gray-300 text-sm mb-4">Short summary of the resource goes here. This is a placeholder for dynamic content.</div>
            <div className="inline-block bg-purple-700 text-white px-3 py-1 rounded-full text-xs">Original</div>
          </div>
        ))}
      </div>
    </section>
  );
}
