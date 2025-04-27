"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Speedometer component for visualizing tech metrics
const Speedometer = () => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const metrics = [
    { value: 2, label: "Skills now expire in ~2 years", color: "#00c8ff" },
    { value: 67.2, label: "AI investment hit $67.2B", color: "#1d5cff" },
    { value: 90, label: "Blockchain scaling at 90% CAGR", color: "#ffd700" },
    { value: 41, label: "AR/VR shipments up 41%", color: "#ff00ff" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentData = metrics[currentMetric];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Speedometer visualization */}
      <div className="relative w-64 h-64">
        {/* Speedometer background */}
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d5cff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00c8ff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Speedometer track */}
          <circle 
            cx="100" 
            cy="100" 
            r="80" 
            fill="none" 
            stroke="rgba(80,220,255,0.2)" 
            strokeWidth="10" 
            strokeLinecap="round"
          />
          
          {/* Animated arc */}
          <motion.path
            d={`M 30 100 A 70 70 0 1 1 170 100`}
            fill="none"
            stroke="url(#speedGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="440"
            initial={{ strokeDashoffset: 440 }}
            animate={{ 
              strokeDashoffset: 440 - (440 * currentData.value / 100),
              stroke: currentData.color
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Center circle */}
          <circle 
            cx="100" 
            cy="100" 
            r="60" 
            fill="#000000" 
            stroke="rgba(80,220,255,0.3)" 
            strokeWidth="1" 
          />
        </svg>
        
        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div 
            className="font-orbitron text-5xl font-bold bg-gradient-to-r from-[#1d5cff] to-[#00c8ff] bg-clip-text text-transparent"
            key={currentData.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {currentData.value}
            <span className="text-2xl">{currentData.value === 90 ? '%' : ''}</span>
          </motion.div>
        </div>
      </div>
      
      {/* Metric label */}
      <motion.div 
        className="mt-6 text-center text-lg font-futureTech text-cyan-200"
        key={currentData.label}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentData.label}
      </motion.div>
    </div>
  );
};

// Main FastLaneSection component
export default function FastLaneSection() {
  // Animation variants for staggered text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="intro" className="py-16 md:py-24 bg-black text-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Left column: Content */}
          <div className="lg:w-1/2">
            <motion.h2 
              className="font-orbitron text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent pb-1"
              variants={itemVariants}
            >
              Welcome to the Fast Lane
            </motion.h2>
            
            <motion.p 
              className="text-base md:text-lg leading-7 text-gray-300 mb-8"
              variants={itemVariants}
            >
              The world's most disruptive technologies are no longer creeping forward—they're accelerating in a blur. Artificial intelligence, blockchain, mixed‑reality, synthetic biology, and quantum computing are compounding so quickly that by the time you finish this paragraph, a new model, protocol, or headset spec will already be out. <span className="font-bold text-white">FutureFast</span> exists to help you keep up—then leap ahead.
            </motion.p>
            
            <motion.h3 
              className="font-orbitron text-2xl font-bold mb-4 text-white"
              variants={itemVariants}
            >
              Why This Matters
            </motion.h3>
            
            <motion.ul className="space-y-3 mb-8" variants={itemVariants}>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                <span className="text-gray-300">Skills now expire in ~2 years – the technical "half‑life" has shrunk from a decade to &lt; 30 months.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                <span className="text-gray-300">AI investment is exploding – U.S. spending hit <span className="font-bold text-white">$67.2 B</span> last year, dwarfing every other nation.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                <span className="text-gray-300">Blockchain is scaling at break‑neck speed – projected to reach <span className="font-bold text-white">$1.43 T</span> by 2030 (≈ 90% CAGR).</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                <span className="text-gray-300">AR/VR shipments rebound – forecast to jump <span className="font-bold text-white">41%</span> in 2025 on the path to <span className="font-bold text-white">22.9 M</span> units by 2028.</span>
              </li>
            </motion.ul>
            
            <motion.p 
              className="text-base md:text-lg leading-7 text-gray-300"
              variants={itemVariants}
            >
              Most executives see the headlines but miss the velocity. Our mission is to translate that speed into clear insight and practical next steps—so you can build, invest, and lead before the curve.
            </motion.p>
          </div>
          
          {/* Right column: Speedometer */}
          <motion.div 
            className="lg:w-2/5 flex justify-center"
            variants={itemVariants}
          >
            <div className="w-full max-w-md aspect-square bg-black border border-[#00c8ff]/20 shadow-lg p-6 flex items-center justify-center rounded-2xl">
              <Speedometer />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
