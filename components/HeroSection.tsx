import React from 'react';

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] w-full overflow-hidden bg-black"
      style={{ backgroundImage: 'url(/FutureFastBack1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />
      {/* Animated content here */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-24">
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in drop-shadow-xl">
          Win the Race of <br className="hidden md:inline" />Exponential Disruption
        </h1>
        <div className="mt-6 flex justify-center">
          <span className="font-orbitron text-lg md:text-2xl px-6 py-3 rounded-xl bg-black/60 border border-cyan-400 shadow-lg text-cyan-200 tracking-wide animate-fade-in backdrop-blur-sm">
            Executive-level insights on AI, Web3, Robotics & more
          </span>
        </div>
      </div>
    </section>
  );
}
