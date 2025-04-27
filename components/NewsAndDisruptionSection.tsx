"use client";

import React from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { trackNewsClick, trackDisruptionWeeklyClick } from '../lib/analytics';

// News items are now loaded from markdown files in /content/news/
// This hardcoded data is just for development/preview
const newsItems = [
  {
    title: 'xAI\'s Grok chatbot can now \'see\' the world around it',
    source: 'TechCrunch',
    date: 'April 22, 2025',
    url: 'https://techcrunch.com/2025/04/22/xais-grok-chatbot-can-now-see-the-world-around-it/',
    icon: '📸'
  },
  {
    title: 'OpenAI launches GPT-4.1 with major improvements in reasoning, memory, and tool use',
    source: 'The Decoder',
    date: 'April 20, 2025',
    url: 'https://the-decoder.com/openai-launches-gpt-4-1-new-model-family-to-improve-agents-long-contexts-and-coding/',
    icon: '✨'
  },
  {
    title: 'AI 50 2025: AI Agents Move Beyond Chat',
    source: 'Forbes',
    date: 'April 10, 2025',
    url: 'https://www.forbes.com/sites/konstantinebuhler/2025/04/10/ai-50-2025-ai-agents-move-beyond-chat/',
    icon: '✨'
  },
  {
    title: 'Runway\'s Gen-3 Alpha Turbo is here and can make AI videos faster than you can type',
    source: 'VentureBeat',
    date: 'April 8, 2025',
    url: 'https://venturebeat.com/ai/runways-gen-3-alpha-turbo-is-here-and-can-make-ai-videos-faster-than-you-can-type/',
    icon: '🎥'
  }
];

export default function NewsAndDisruptionSection() {
  return (
    <section className="py-16 bg-black text-white" id="news-and-disruption">
      <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">In The News</h1>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* News Articles - Left Side */}
        <div className="lg:w-1/2">
          <ul>
            {newsItems.map((item, idx) => (
              <li 
                key={idx} 
                className="py-4 transition-all duration-200 hover:bg-gray-900/50 px-3 rounded-lg"
              >
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackNewsClick(item.title, item.source, item.url)}
                  className="flex flex-col md:flex-row md:items-center gap-2 w-full group"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">
                      {item.icon && <span className="mr-2" style={{fontSize: '1.25rem'}}>{item.icon}</span>}
                      {item.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center mt-1 text-xs text-gray-400 gap-3">
                      <div className="flex items-center gap-1">
                        <FaNewspaper className="text-cyan-500" />
                        <span>{item.source}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-cyan-500" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <span className="text-cyan-500 group-hover:translate-x-1 transition-transform duration-200">
                      <FaExternalLinkAlt />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Disruption Weekly - Right Side */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Disruption Weekly</h2>
          <p className="text-center text-gray-300 mb-4">Click below to subscribe on LinkedIn</p>
          <a 
            href="https://www.linkedin.com/newsletters/disruption-weekly-7120892654304776192/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={trackDisruptionWeeklyClick}
            className="block w-full max-w-md mx-auto group"
          >
            <div className="relative overflow-hidden rounded-xl border-2 border-cyan-400 transition-all duration-300 group-hover:shadow-cyan-500/30 group-hover:shadow-xl">
              <Image
                src="/images/disruption-weekly.png"
                alt="Disruption Weekly Newsletter"
                width={600}
                height={338}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
