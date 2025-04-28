'use client';

import React from 'react';

interface Quote {
  text: string;
  author: string;
}

interface QuotesMarqueeProps {
  quotes: Quote[];
}

export default function QuotesMarquee({ quotes }: QuotesMarqueeProps) {
  return (
    <>
      <div className="flex animate-marquee whitespace-nowrap">
        {quotes.map((quote, index) => (
          <div key={index} className="mx-8 flex items-center">
            <span className="text-3xl text-white font-light">
              &ldquo;{quote.text}&rdquo; <span className="text-cyan-300 ml-2">— {quote.author}</span>
            </span>
          </div>
        ))}
        
        {/* Duplicate quotes for seamless loop */}
        {quotes.map((quote, index) => (
          <div key={`dup-${index}`} className="mx-8 flex items-center">
            <span className="text-3xl text-white font-light">
              &ldquo;{quote.text}&rdquo; <span className="text-cyan-300 ml-2">— {quote.author}</span>
            </span>
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
    </>
  );
}
