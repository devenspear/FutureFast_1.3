import React from 'react';

const headline = "Mapping the Curve of Exponential Disruption";

// Animated blurred dots for hero section
function AnimatedOrbs() {
  return (
    <>
      {/* Blurred Dot 1 */}
      <div
        className="absolute top-10 left-10 w-16 h-16 rounded-full bg-blue-400/30 blur-2xl animate-orb1 pointer-events-none"
        style={{ animationDelay: '0s' }}
      />
      {/* Blurred Dot 2 */}
      <div
        className="absolute bottom-16 left-1/3 w-20 h-20 rounded-full bg-purple-400/25 blur-2xl animate-orb2 pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
      {/* Blurred Dot 3 */}
      <div
        className="absolute top-1/2 right-20 w-12 h-12 rounded-full bg-cyan-300/20 blur-2xl animate-orb3 pointer-events-none"
        style={{ animationDelay: '4s' }}
      />
      {/* Blurred Dot 4 */}
      <div
        className="absolute bottom-10 right-1/4 w-24 h-24 rounded-full bg-pink-300/20 blur-3xl animate-orb4 pointer-events-none"
        style={{ animationDelay: '1.5s' }}
      />
    </>
  );
}

const backgroundImage = '/expoCurve_back2.jpg';

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] w-full overflow-hidden bg-black"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />
      {/* Animated orbs and content here */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full">
        {/* Animated blurred dots */}
        <AnimatedOrbs />
        <h1
          className="relative z-10 text-4xl md:text-6xl font-bold text-white tracking-tight animate-slide-up text-center bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent"
          style={{ fontFamily: "var(--font-orbitron), Arial, Helvetica, sans-serif" }}
        >
          {headline}
        </h1>
        <p
          className="relative z-10 mt-4 text-lg md:text-2xl text-purple-200 font-futureTech animate-typewriter border-r-2 border-purple-200 pr-2 text-center"
        >
          Charting the future, one breakthrough at a time.
        </p>
      </div>
    </section>
  );
}
