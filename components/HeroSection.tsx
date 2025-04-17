import React from 'react';

const headline = "Mapping the Curve of Exponential Disruption";

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
