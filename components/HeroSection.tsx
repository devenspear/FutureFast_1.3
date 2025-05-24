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
          25% { transform: translateY(-45px) translateX(24px) scale(1.09); }
          50% { transform: translateY(-24px) translateX(-30px) scale(0.91); }
          75% { transform: translateY(-60px) translateX(12px) scale(1.03); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-36px) translateX(-18px) scale(1.15); }
          66% { transform: translateY(-54px) translateX(24px) scale(0.85); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          20% { transform: translateY(-18px) translateX(-12px) scale(1.24); }
          40% { transform: translateY(-30px) translateX(18px) scale(0.76); }
          60% { transform: translateY(-12px) translateX(-6px) scale(1.12); }
          80% { transform: translateY(-42px) translateX(12px) scale(0.88); }
        }
        
        @keyframes float-ambient {
          0% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-24px) translateX(-9px) scale(1.18) rotate(90deg); }
          50% { transform: translateY(-12px) translateX(18px) scale(0.82) rotate(180deg); }
          75% { transform: translateY(-36px) translateX(6px) scale(1.06) rotate(270deg); }
          100% { transform: translateY(0px) translateX(0px) scale(1) rotate(360deg); }
        }
        
        @keyframes float-ultra {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          16% { transform: translateY(-20px) translateX(15px) scale(1.2) rotate(60deg); }
          33% { transform: translateY(-35px) translateX(-10px) scale(0.8) rotate(120deg); }
          50% { transform: translateY(-15px) translateX(20px) scale(1.1) rotate(180deg); }
          66% { transform: translateY(-45px) translateX(-5px) scale(0.9) rotate(240deg); }
          83% { transform: translateY(-25px) translateX(12px) scale(1.15) rotate(300deg); }
        }
        
        @keyframes float-mega {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          20% { transform: translateY(-50px) translateX(-25px) scale(1.25); }
          40% { transform: translateY(-30px) translateX(35px) scale(0.75); }
          60% { transform: translateY(-65px) translateX(-15px) scale(1.05); }
          80% { transform: translateY(-40px) translateX(20px) scale(0.95); }
        }
        
        @keyframes float-spiral {
          0% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(30px) scale(1.3) rotate(90deg); }
          50% { transform: translateY(-60px) translateX(0px) scale(0.7) rotate(180deg); }
          75% { transform: translateY(-30px) translateX(-30px) scale(1.1) rotate(270deg); }
          100% { transform: translateY(0px) translateX(0px) scale(1) rotate(360deg); }
        }
        
        @keyframes float-pulse {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          25% { transform: translateY(-35px) translateX(20px) scale(1.4); opacity: 0.8; }
          50% { transform: translateY(-20px) translateX(-25px) scale(0.6); opacity: 0.2; }
          75% { transform: translateY(-50px) translateX(10px) scale(1.2); opacity: 0.6; }
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
      
      {/* Animated floating bubbles - enhanced with 200% more movement and variety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large slow bubble - enhanced movement */}
        <div 
          className="absolute w-20 h-20 rounded-full opacity-8 bg-gradient-to-br from-cyan-400 to-blue-500"
          style={{
            animation: 'float-slow 20s ease-in-out infinite',
            top: '12%',
            left: '18%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Medium bubble - enhanced movement */}
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
        
        {/* Small fast bubble - enhanced movement */}
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
        
        {/* Tiny ambient bubble */}
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
        
        {/* Another medium bubble for balance */}
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
        
        {/* NEW BUBBLES - 200% more with varied characteristics */}
        
        {/* Ultra dynamic small bubble */}
        <div 
          className="absolute w-8 h-8 rounded-full opacity-4 bg-gradient-to-br from-purple-400 to-blue-600"
          style={{
            animation: 'float-ultra 12s ease-in-out infinite',
            top: '25%',
            left: '45%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Mega movement large bubble */}
        <div 
          className="absolute w-18 h-18 rounded-full opacity-6 bg-gradient-to-br from-cyan-500 to-teal-400"
          style={{
            animation: 'float-mega 22s ease-in-out infinite',
            top: '55%',
            left: '70%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Spiral moving bubble */}
        <div 
          className="absolute w-16 h-16 rounded-full opacity-5 bg-gradient-to-br from-indigo-300 to-purple-500"
          style={{
            animation: 'float-spiral 28s ease-in-out infinite',
            top: '20%',
            right: '35%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Pulsing transparent bubble */}
        <div 
          className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-cyan-300"
          style={{
            animation: 'float-pulse 16s ease-in-out infinite',
            top: '80%',
            left: '30%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Fast small bubble - top right */}
        <div 
          className="absolute w-7 h-7 rounded-full opacity-8 bg-gradient-to-br from-teal-300 to-blue-400"
          style={{
            animation: 'float-fast 8s ease-in-out infinite reverse',
            top: '15%',
            right: '10%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Medium ultra bubble - center left */}
        <div 
          className="absolute w-11 h-11 rounded-full opacity-3 bg-gradient-to-br from-cyan-400 to-indigo-600"
          style={{
            animation: 'float-ultra 14s ease-in-out infinite reverse',
            top: '40%',
            left: '5%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Large spiral bubble - bottom center */}
        <div 
          className="absolute w-15 h-15 rounded-full opacity-4 bg-gradient-to-br from-blue-500 to-purple-400"
          style={{
            animation: 'float-spiral 26s ease-in-out infinite reverse',
            bottom: '20%',
            left: '50%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Tiny fast bubbles cluster */}
        <div 
          className="absolute w-5 h-5 rounded-full opacity-6 bg-gradient-to-br from-cyan-200 to-blue-300"
          style={{
            animation: 'float-fast 6s ease-in-out infinite',
            top: '30%',
            left: '25%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        <div 
          className="absolute w-4 h-4 rounded-full opacity-7 bg-gradient-to-br from-blue-300 to-indigo-400"
          style={{
            animation: 'float-medium 9s ease-in-out infinite',
            top: '70%',
            right: '45%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Large slow-moving bubble - top center */}
        <div 
          className="absolute w-19 h-19 rounded-full opacity-5 bg-gradient-to-br from-indigo-400 to-cyan-500"
          style={{
            animation: 'float-slow 24s ease-in-out infinite',
            top: '8%',
            left: '55%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Pulse bubble - right side */}
        <div 
          className="absolute w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500"
          style={{
            animation: 'float-pulse 18s ease-in-out infinite reverse',
            top: '50%',
            right: '8%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        {/* Ambient tiny bubbles */}
        <div 
          className="absolute w-3 h-3 rounded-full opacity-9 bg-gradient-to-br from-cyan-300 to-blue-200"
          style={{
            animation: 'float-ambient 20s linear infinite',
            top: '60%',
            left: '15%',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        
        <div 
          className="absolute w-6 h-6 rounded-full opacity-4 bg-gradient-to-br from-blue-400 to-purple-300"
          style={{
            animation: 'float-ambient 30s linear infinite reverse',
            bottom: '25%',
            right: '20%',
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
