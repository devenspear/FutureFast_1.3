import React from 'react';

export default function FeaturedInsight() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white animate-fade-in" id="featured">
      {/* Parallax background placeholder */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/40 via-transparent to-indigo-900/30 animate-gradient-x" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <blockquote
          className="text-2xl md:text-4xl font-semibold italic mb-6 animate-slide-up"
        >
          “The future arrives gradually, then all at once.”
        </blockquote>
        <a
          href="#"
          className="inline-block px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-full text-white font-bold text-lg shadow-lg transition-all hover:scale-105 animate-fade-in"
        >
          Read More
        </a>
      </div>
    </section>
  );
}
