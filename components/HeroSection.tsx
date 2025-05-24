'use client';

import React, { useEffect, useState } from 'react';

// Sampled hero image colors (example):
// Blue: #1d5cff
// Gold: #ffd700

export default function HeroSection() {
  const [content, setContent] = useState({ headline: '', subheadline: '' });

  useEffect(() => {
    // Load content from the server
    fetch('/api/hero')
      .then(response => response.json())
      .then(data => setContent(data))
      .catch(error => {
        console.error('Error loading hero content:', error);
        // Fallback content
        setContent({
          headline: 'Future Fast',
          subheadline: 'Accelerating Tomorrow\'s Innovations Today'
        });
      });

    // Add animation styles to document head if not already added
    if (typeof document !== 'undefined' && !document.getElementById('hero-animations')) {
      const style = document.createElement('style');
      style.id = 'hero-animations';
      style.textContent = `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          25% { transform: translateY(-15px) translateX(8px) scale(1.03); }
          50% { transform: translateY(-8px) translateX(-10px) scale(0.97); }
          75% { transform: translateY(-20px) translateX(4px) scale(1.01); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-12px) translateX(-6px) scale(1.05); }
          66% { transform: translateY(-18px) translateX(8px) scale(0.95); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          20% { transform: translateY(-6px) translateX(-4px) scale(1.08); }
          40% { transform: translateY(-10px) translateX(6px) scale(0.92); }
          60% { transform: translateY(-4px) translateX(-2px) scale(1.04); }
          80% { transform: translateY(-14px) translateX(4px) scale(0.96); }
        }
        
        @keyframes float-ambient {
          0% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-8px) translateX(-3px) scale(1.06) rotate(90deg); }
          50% { transform: translateY(-4px) translateX(6px) scale(0.94) rotate(180deg); }
          75% { transform: translateY(-12px) translateX(2px) scale(1.02) rotate(270deg); }
          100% { transform: translateY(0px) translateX(0px) scale(1) rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[65vh] md:min-h-[85vh] w-full overflow-hidden bg-black"
    >
      {/* Background image without darkening overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/FutureFastBack1.jpg)' }}
      />
      
      {/* Animated floating bubbles - smaller sizes to not exceed background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large slow bubble - reduced from w-32 to w-20 */}
        <div 
          className="absolute w-20 h-20 rounded-full opacity-8 bg-gradient-to-br from-cyan-400 to-blue-500"
          style={{
            animation: 'float-slow 20s ease-in-out infinite',
            top: '12%',
            left: '18%',
            transform: 'translateZ(0)', // Hardware acceleration
            willChange: 'transform'
          }}
        />
        
        {/* Medium bubble - reduced from w-20 to w-14 */}
        <div 
          className="absolute w-14 h-14 rounded-full opacity-6 bg-gradient-to-br from-blue-400 to-indigo-500"
          style={{
            animation: 'float-medium 15s ease-in-out infinite reverse',
            top: '65%',
            right: '25%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Small fast bubble - reduced from w-12 to w-10 */}
        <div 
          className="absolute w-10 h-10 rounded-full opacity-10 bg-gradient-to-br from-cyan-300 to-blue-400"
          style={{
            animation: 'float-fast 10s ease-in-out infinite',
            top: '35%',
            right: '15%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Tiny ambient bubble - kept small */}
        <div 
          className="absolute w-6 h-6 rounded-full opacity-5 bg-gradient-to-br from-blue-300 to-cyan-400"
          style={{
            animation: 'float-ambient 25s linear infinite',
            top: '75%',
            left: '75%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Another medium bubble for balance - reduced from w-16 to w-12 */}
        <div 
          className="absolute w-12 h-12 rounded-full opacity-7 bg-gradient-to-br from-indigo-400 to-blue-500"
          style={{
            animation: 'float-slow 18s ease-in-out infinite reverse',
            top: '45%',
            left: '8%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Subtle bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black to-transparent z-10" />
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
        <div className="mt-6 flex justify-center w-full max-w-4xl mx-auto">
          <div className="font-orbitron text-lg md:text-xl lg:text-2xl text-center w-full max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-black/70 via-indigo-950/60 to-black/70 border-2 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] text-cyan-100 tracking-wide backdrop-blur-md flex items-center justify-center h-[110px] animate-pulse-subtle">
            {content.subheadline}
          </div>
        </div>
      </div>
    </section>
  );
}
