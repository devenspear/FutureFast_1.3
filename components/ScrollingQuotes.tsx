"use client";

import React, { useEffect, useRef } from 'react';

interface Quote {
  text: string;
  author?: string;
}

interface ScrollingQuotesProps {
  quotes: (string | Quote)[];
  speed?: 'slow' | 'medium' | 'fast';
  pauseOnHover?: boolean;
  direction?: 'left-to-right' | 'right-to-left';
}

// Default quotes in case the markdown file isn't loaded
const defaultQuotes = [
  { text: "The best way to predict the future is to create it.", author: "Alan Kay" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "The future is already here – it's just not evenly distributed.", author: "William Gibson" },
];

export default function ScrollingQuotes({
  quotes = defaultQuotes,
  speed = 'medium',
  pauseOnHover = true,
  direction = 'left-to-right'
}: ScrollingQuotesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  // Convert any string quotes to Quote objects
  const formattedQuotes: Quote[] = quotes.map(quote => 
    typeof quote === 'string' ? { text: quote } : quote
  );
  
  // Set animation speed
  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return '60s';
      case 'fast': return '20s';
      case 'medium':
      default: return '30s';
    }
  };

  // Set animation direction
  const getAnimationDirection = () => {
    return direction === 'right-to-left' ? 'normal' : 'reverse';
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Clone quotes to create a seamless loop
    const scrollerContent = scroller.querySelector('.scroller-content');
    if (scrollerContent) {
      const scrollerClone = scrollerContent.cloneNode(true);
      scroller.appendChild(scrollerClone);
    }
  }, []);

  return (
    <div className="w-full bg-gray-900 py-8 overflow-hidden">
      <div 
        ref={scrollerRef}
        className="scroller relative flex overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div 
          className="scroller-content flex space-x-12 animate-scroll"
          style={{
            animationDuration: getAnimationDuration(),
            animationDirection: getAnimationDirection(),
            animationPlayState: 'running',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationName: 'scroll',
            ...(pauseOnHover ? { '&:hover': { animationPlayState: 'paused' } } : {})
          }}
        >
          {formattedQuotes.map((quote, index) => (
            <div key={index} className="flex-shrink-0 flex items-center">
              <div className="text-white text-xl md:text-2xl font-medium">
                <span className="text-cyan-400 mr-2">"</span>
                {quote.text}
                <span className="text-cyan-400 ml-2">"</span>
                {quote.author && (
                  <span className="text-gray-400 text-base ml-2">— {quote.author}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
        .scroller-content:hover {
          ${pauseOnHover ? 'animation-play-state: paused;' : ''}
        }
      `}</style>
    </div>
  );
}
