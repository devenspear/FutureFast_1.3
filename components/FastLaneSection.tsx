"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Main FastLaneSection component
export default function FastLaneSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Ensure video loops continuously
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay error:", error);
      });
    }
  }, []);

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
    <section id="intro" className="pt-0 pb-16 md:pt-0 md:pb-24 bg-black text-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Left column: Video */}
          <motion.div 
            className="lg:w-2/5 flex justify-center order-2 lg:order-1"
            variants={itemVariants}
          >
            <div className="w-full max-w-md aspect-square bg-black border border-[#00c8ff]/20 shadow-lg rounded-2xl overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                src="/images/FutureFastVideoLoop.mp4"
              />
            </div>
          </motion.div>
          
          {/* Right column: Content */}
          <div className="lg:w-1/2 order-1 lg:order-2">
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
              The world&apos;s most disruptive technologies are no longer creeping forward—they&apos;re accelerating in a blur. Artificial intelligence, blockchain, mixed‑reality, synthetic biology, and quantum computing are compounding so quickly that by the time you finish this paragraph, a new model, protocol, or headset spec will already be out. <span className="font-bold text-white">FutureFast</span> exists to help you keep up—then leap ahead.
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
                <span className="text-gray-300">Skills now expire in ~2 years – the technical &ldquo;half‑life&rdquo; has shrunk from a decade to &lt; 30 months.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                <span className="text-gray-300">AI investment is exploding – U.S. spending hit <span className="font-bold text-white">$67.2 B</span> last year, dwarfing every other nation.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                <span className="text-gray-300">Blockchain is scaling at break‑neck speed – projected to reach <span className="font-bold text-white">$1.43 T</span> by 2030 (&asymp; 90% CAGR).</span>
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
        </motion.div>
      </div>
    </section>
  );
}
