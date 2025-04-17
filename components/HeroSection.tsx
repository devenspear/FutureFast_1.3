import React from 'react';

const headline = "Mapping the Curve of Exponential Disruption";

// Animated floating objects for hero section
function AnimatedOrbs() {
  return (
    <>
      {/* Blue Orb */}
      <div
        className="absolute top-10 left-10 w-16 h-16 rounded-full bg-blue-400/30 blur-md animate-orb1 pointer-events-none"
        style={{ animationDelay: '0s' }}
      />
      {/* Purple Orb */}
      <div
        className="absolute bottom-16 left-1/3 w-20 h-20 rounded-full bg-purple-500/25 blur-lg animate-orb2 pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
      {/* Cyan Orb */}
      <div
        className="absolute top-1/2 right-20 w-12 h-12 rounded-full bg-cyan-300/20 blur-md animate-orb3 pointer-events-none"
        style={{ animationDelay: '4s' }}
      />
      {/* Grid Dot */}
      <div
        className="absolute bottom-10 right-1/4 w-6 h-6 rounded-full bg-white/10 border border-cyan-400/30 animate-orb4 pointer-events-none"
        style={{ animationDelay: '1.5s' }}
      />
    </>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden animate-fade-in"
      style={{
        backgroundImage: "url('/expoCurve_back2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Optional: Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />
      {/* Animated floating objects */}
      <AnimatedOrbs />
      <h1
        className="relative z-10 text-4xl md:text-6xl font-bold text-white tracking-tight animate-slide-up"
        style={{ fontFamily: "var(--font-orbitron), Arial, Helvetica, sans-serif" }}
      >
        {headline}
      </h1>
      <p
        className="relative z-10 mt-4 text-lg md:text-2xl text-purple-200 font-futureTech animate-typewriter border-r-2 border-purple-200 pr-2"
      >
        Charting the future, one breakthrough at a time.
      </p>
    </section>
  );
}
