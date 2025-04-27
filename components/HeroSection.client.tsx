"use client";

import React from 'react';

export interface HeroContent {
  headline: string;
  subheadline: string;
}

export interface HeroSectionClientProps {
  content: HeroContent;
}

export default function HeroSectionClient({ content }: HeroSectionClientProps) {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[85vh] w-full overflow-hidden bg-black"
    >
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/FutureFastBack1.jpg)' }}
      />
      
      {/* Top overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />
      
      {/* Bottom gradient layers for smooth transition */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/90 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-purple-900/10 to-transparent z-10 opacity-60 blur-md" />
      <div className="absolute inset-x-0 bottom-[-20px] h-[20px] bg-black z-10" /> {/* Solid black bottom to ensure perfect transition */}
      
      {/* Animated content here */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-24">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-[#1d5cff] via-[#ffd700] to-[#1d5cff] bg-clip-text text-transparent animate-fade-in drop-shadow-xl">
          {content.headline.split(' ').length > 4 ? (
            <>
              {content.headline.split(' ').slice(0, 4).join(' ')} <br className="hidden md:inline" />
              {content.headline.split(' ').slice(4).join(' ')}
            </>
          ) : (
            content.headline
          )}
        </h1>
        <div className="mt-6 flex justify-center">
          <span className="font-orbitron text-lg md:text-2xl px-6 py-3 rounded-xl bg-black/60 border border-cyan-400 shadow-lg text-cyan-200 tracking-wide animate-fade-in backdrop-blur-sm">
            {content.subheadline}
          </span>
        </div>
      </div>
    </section>
  );
}
