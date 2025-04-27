"use client";

import React from 'react';
import Image from 'next/image';

export interface AboutContent {
  headline: string;
  subheadline: string;
}

export interface AboutFutureFastClientProps {
  content: AboutContent;
}

export default function AboutFutureFastClient({ content }: AboutFutureFastClientProps) {
  return (
    <section className="w-full py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-300">{content.headline}</h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">{content.subheadline}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-900 p-6 rounded-lg border border-cyan-800 hover:border-cyan-400 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">Executive-First</h3>
              <p className="text-gray-300">Written for decision-makers, not developers. No code, just clarity.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-cyan-800 hover:border-cyan-400 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">Neutral Librarian</h3>
              <p className="text-gray-300">We curate all credible voices—McKinsey, CB Insights, podcasts, whitepapers—so you don't have to.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-cyan-800 hover:border-cyan-400 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">Radically Clear</h3>
              <p className="text-gray-300">If a ninth-grader can't understand it, we rewrite it. Clarity is our obsession.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
