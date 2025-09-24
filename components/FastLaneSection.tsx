"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AncientDarkGalaxy from './AncientDarkGalaxy';

// Main FastLaneSection component
export default function FastLaneSection() {
  const content = {
    headline: "Welcome to the Fast Lane",
    intro: "The pace of change is accelerating—yet despite constant headlines and bold predictions, the urgency of exponential disruption rarely registers in boardrooms or strategic plans. FutureFast was created to bridge that gap: turning the abstract hum of exponential change into actionable insight before it blindsides organizations.",
    why_it_matters_heading: "Why It Matters",
    bullet_points: [
      "Product cycles are compressing from years to months",
      "AI models are advancing by entire generations every season",
      "The digital and physical worlds are converging in real time",
      "Today's essential skills risk obsolescence by next quarter"
    ],
    closing_text: "While most leaders glance at trends, few grasp the velocity behind them. FutureFast functions as both clutch and accelerator—filtering noise, surfacing meaningful signals, and delivering practical frameworks to build, invest, and lead ahead of the curve.",
    call_to_action: "Ready to keep pace? Scroll down and let's move. ⚡️"
  };

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
    <section id="intro" className="pb-16 md:pb-24 bg-black text-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Left column: Exponential Growth Chart (replacing video) */}
          <motion.div 
            className="lg:w-2/5 flex justify-center items-center order-2 lg:order-1 mx-auto w-full"
            variants={itemVariants}
          >
            <div className="w-full flex justify-center items-center">
              <AncientDarkGalaxy />
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
