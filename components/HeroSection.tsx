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
        <div className="mt-6 flex justify-center w-full max-w-4xl mx-auto">
          <div className="font-orbitron text-lg md:text-xl lg:text-2xl text-center w-full max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-black/70 via-indigo-950/60 to-black/70 border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] text-cyan-100 tracking-wide backdrop-blur-md flex items-center justify-center h-[110px] animate-pulse-subtle">
            {subheadline}
          </div>
        </div>
      </div>
    </section>
  );
}
