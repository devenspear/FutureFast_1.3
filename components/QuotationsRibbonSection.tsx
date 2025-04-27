'use client';
import React from 'react';

// Default quotes - these will be replaced by data from the markdown file in production
const defaultQuotes = [
  { text: "The best way to predict the future is to create it.", author: "Alan Kay" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "The future is already here – it's just not evenly distributed.", author: "William Gibson" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
];

export default function QuotationsRibbonSection() {
  // In production, this would load from the markdown file
  const quotes = defaultQuotes;
  
  return (
    <section className="w-full bg-gray-900 py-8 overflow-hidden">
      <div 
        className="whitespace-nowrap animate-marquee flex items-center"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        {quotes.map((quote, idx) => (
          <div key={idx} className="mx-12 inline-block text-xl md:text-2xl font-medium text-white">
            <span className="text-cyan-400 mr-2">"</span>
            {quote.text}
            <span className="text-cyan-400 ml-2">"</span>
            {quote.author && (
              <span className="text-gray-400 text-base ml-2">— {quote.author}</span>
            )}
          </div>
        ))}
        {/* Repeat for infinite effect */}
        {quotes.map((quote, idx) => (
          <div key={idx + quotes.length} className="mx-12 inline-block text-xl md:text-2xl font-medium text-white">
            <span className="text-cyan-400 mr-2">"</span>
            {quote.text}
            <span className="text-cyan-400 ml-2">"</span>
            {quote.author && (
              <span className="text-gray-400 text-base ml-2">— {quote.author}</span>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
