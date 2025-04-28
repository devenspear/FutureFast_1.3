"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Main FastLaneSection component
export default function FastLaneSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const content = {
    headline: "Welcome to the Fast Lane",
    intro: "I've spent years tracking the thinkers who keep shouting \"Everything is speeding up!\"—yet in boardrooms and project meetings the urgency rarely lands. That disconnect is why FutureFast exists: to translate the hum of exponential change into something you can actually act on before it blindsides your business.",
    why_it_matters_heading: "Why It Matters",
    bullet_points: [
      "Product cycles now shrink from years → months",
      "AI models leap a generation ahead every season",
      "Digital + physical worlds are merging in real time",
      "Skills you master today can be obsolete by next quarter"
    ],
    closing_text: "Most leaders skim headlines; few feel the velocity. Let this site be your clutch and accelerator—cutting the noise, surfacing the signals, and giving you the frameworks to build, invest, and lead ahead of the curve.",
    call_to_action: "Ready to keep pace? Scroll down and let's move. ⚡️"
  };
  
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
              {content.headline}
            </motion.h2>
            
            <motion.p 
              className="text-base md:text-lg leading-7 text-gray-300 mb-8"
              variants={itemVariants}
            >
              {content.intro}
            </motion.p>
            
            <motion.h3 
              className="font-orbitron text-2xl font-bold mb-4 text-white"
              variants={itemVariants}
            >
              {content.why_it_matters_heading}
            </motion.h3>
            
            <motion.ul className="space-y-3 mb-8" variants={itemVariants}>
              {content.bullet_points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-5 h-5 mr-2 text-[#00c8ff] font-bold">•</span>
                  <span className="text-gray-300">{point}</span>
                </li>
              ))}
            </motion.ul>
            
            <motion.p 
              className="text-base md:text-lg leading-7 text-gray-300"
              variants={itemVariants}
            >
              {content.closing_text}
            </motion.p>
            
            <motion.p 
              className="text-base md:text-lg leading-7 text-gray-300 mt-4 font-semibold"
              variants={itemVariants}
            >
              {content.call_to_action}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
