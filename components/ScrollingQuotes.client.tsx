"use client";

import React from 'react';

export interface Quote {
  text: string;
  author: string;
}

export interface ScrollingQuotesClientProps {
  quotes: Quote[];
}

export default function ScrollingQuotesClient({ quotes }: ScrollingQuotesClientProps) {
  return (
    <section className="w-full bg-black py-8 overflow-hidden relative">
      <div className="whitespace-nowrap animate-marquee flex items-center absolute left-0 right-0">
        {quotes.map((quote, idx) => (
          <div key={idx} className="mx-12 inline-block text-xl md:text-2xl font-medium">
            <span style={{ color: '#3A0B2F' }} className="mr-2">&ldquo;</span>
            <span style={{ color: '#3A0B2F' }}>{quote.text}</span>
            <span style={{ color: '#3A0B2F' }} className="ml-2">&rdquo;</span>
            {quote.author && (
              <span style={{ color: '#3A0B2F' }} className="ml-2 text-lg">
                — {quote.author}
              </span>
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
