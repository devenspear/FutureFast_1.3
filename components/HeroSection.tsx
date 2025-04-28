'use server';

import React from 'react';
import { loadHeroContent } from '../lib/content-loader';

// Sampled hero image colors (example):
// Blue: #1d5cff
// Gold: #ffd700

export default async function HeroSection() {
  // Load content from Markdown file
  const { headline, subheadline } = await loadHeroContent();
  
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[85vh] w-full overflow-hidden bg-black"
    >
      {/* Background image without darkening overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/FutureFastBack1.jpg)' }}
      />
      
      {/* Subtle bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-[-20px] h-[20px] bg-black z-10" /> {/* Solid black bottom to ensure perfect transition */}
      
      {/* Animated content here */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-24">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-[#1d5cff] via-[#ffd700] to-[#1d5cff] bg-clip-text text-transparent animate-fade-in drop-shadow-xl">
          {headline.split(' ').length > 4 ? (
            <>
              {headline.split(' ').slice(0, 4).join(' ')} <br className="hidden md:inline" />
              {headline.split(' ').slice(4).join(' ')}
            </>
          ) : (
            headline
          )}
        </h1>
        <div className="mt-6 flex justify-center">
          <span className="font-orbitron text-lg md:text-2xl max-w-3xl mx-auto px-12 py-4 rounded-xl bg-black/60 border border-cyan-400 shadow-lg text-cyan-200 tracking-wide animate-fade-in backdrop-blur-sm">
            {subheadline}
          </span>
        </div>
      </div>
    </section>
  );
}
