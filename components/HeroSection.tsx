import React from 'react';
import RaceTrackParallaxLines from './RaceTrackParallaxLines';
import { getHeroContent } from './HeroSectionContent';

const { headline, subheadline } = getHeroContent();

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] w-full overflow-hidden bg-black"
      style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Race track parallax lines background with animated rainbow dots */}
      <RaceTrackParallaxLines />
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />
      {/* Animated content here */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4">
        <h1
          className="font-orbitron relative z-10 text-5xl md:text-7xl font-bold text-white tracking-tight animate-slide-up text-center bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent break-words max-w-2xl md:max-w-4xl lg:max-w-5xl mb-4"
        >
          {headline}
        </h1>
        <p
          className="relative z-10 mt-4 text-base md:text-2xl text-purple-200 font-futureTech animate-typewriter border-r-2 border-purple-200 pr-2 text-center break-words max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl whitespace-pre-line"
        >
          {subheadline}
        </p>
      </div>
    </section>
  );
}
