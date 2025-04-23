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
        <div className="text-center mb-2">
          <h1 className="font-orbitron text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-slide-up">
            Win the Race of <br className="hidden md:inline" />Exponential Disruption
          </h1>
        </div>
        <div className="mt-6 flex justify-center">
          <span className="font-orbitron text-lg md:text-2xl px-6 py-3 rounded-xl bg-black/60 border border-cyan-400 shadow-lg text-cyan-200 tracking-wide animate-fade-in backdrop-blur-sm">
            Executive-level insights on AI, Web3, Robotics & more
          </span>
        </div>
      </div>
    </section>
  );
}
