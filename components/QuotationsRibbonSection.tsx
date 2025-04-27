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
    <section className="w-full bg-black py-8 overflow-hidden relative">
      <div className="whitespace-nowrap animate-marquee flex items-center absolute left-0 right-0">
        {quotes.map((quote, idx) => (
          <div key={idx} className="mx-12 inline-block text-xl md:text-2xl font-medium">
            <span style={{ color: '#3A0B2F' }} className="mr-2">&ldquo;</span>
            <span style={{ color: '#3A0B2F' }}>{quote.text}</span>
            <span style={{ color: '#3A0B2F' }} className="ml-2">&rdquo;</span>
            {quote.author && (
              <span style={{ color: '#3A0B2F', opacity: 0.8 }} className="text-base ml-2">— {quote.author}</span>
            )}
          </div>
        ))}
        {/* Repeat for infinite effect */}
        {quotes.map((quote, idx) => (
          <div key={idx + quotes.length} className="mx-12 inline-block text-xl md:text-2xl font-medium">
            <span style={{ color: '#3A0B2F' }} className="mr-2">&ldquo;</span>
            <span style={{ color: '#3A0B2F' }}>{quote.text}</span>
            <span style={{ color: '#3A0B2F' }} className="ml-2">&rdquo;</span>
            {quote.author && (
              <span style={{ color: '#3A0B2F', opacity: 0.8 }} className="text-base ml-2">— {quote.author}</span>
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
          width: 100vw;
          position: absolute;
          left: 0;
          right: 0;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
