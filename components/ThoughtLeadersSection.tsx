"use server";

import React from 'react';
import Link from 'next/link';
import { loadThoughtLeaders } from '../lib/content-loader';

// Define types to match the markdown data structure
interface SocialLink {
  emoji: string;
  label: string;
  url: string;
}

interface ThoughtLeader {
  name: string;
  expertise: string;
  socialLinks: SocialLink[];
}

export default async function ThoughtLeadersSection() {
  // Load thought leaders from Markdown file
  const thoughtLeaders = await loadThoughtLeaders() as ThoughtLeader[];
  
  return (
    <section className="py-16 bg-black text-white px-4" id="thought-leaders">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-8 mt-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent break-words">
          Thought Leaders to Follow
        </h1>
        
        <p className="font-sans mb-10 text-lg md:text-xl text-cyan-100 text-center max-w-3xl mx-auto">
          Ideas shape action. These people shape ideas.<br />
          We spotlight the visionaries mapping the edge—across AI, economics, systems design, digital identity, and beyond.<br />
          Follow them now. Thank us later.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-900/50 rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-purple-900/20 text-left">
                <th className="py-4 px-6 font-orbitron text-cyan-300">Name</th>
                <th className="py-4 px-6 font-orbitron text-cyan-300">Area of Expertise</th>
                <th className="py-4 px-6 font-orbitron text-cyan-300">Online Channels to Visit</th>
              </tr>
            </thead>
            <tbody>
              {thoughtLeaders.map((leader, index) => (
                <tr 
                  key={index} 
                  className={`border-t border-purple-800/30 hover:bg-purple-900/20 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'
                  }`}
                >
                  <td className="py-3 px-6 font-bold text-white">{leader.name}</td>
                  <td className="py-3 px-6 text-gray-300">{leader.expertise}</td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-2">
                      {leader.socialLinks.map((link: SocialLink, linkIndex: number) => (
                        <Link 
                          key={linkIndex} 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 hover:bg-purple-800 transition-colors text-white text-xs"
                        >
                          <span>{link.emoji}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            <span className="font-bold">Emoji Key:</span> 🐦 X (Twitter) • 📬 Substack • 📺 YouTube • 💼 LinkedIn • 📸 Instagram • 🎵 TikTok • 🌐 Website • 🎙️ Podcast
          </p>
        </div>
      </div>
    </section>
  );
}
