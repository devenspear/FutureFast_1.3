"use server";

import React from 'react';
import { loadAboutContent } from '../lib/content-loader';

export default async function AboutFutureFast() {
  // Load content from Markdown file
  const { headline, subheadline, features } = await loadAboutContent();
  
  return (
    <section className="w-full py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-300">{headline}</h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">{subheadline}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-cyan-800 hover:border-cyan-400 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-cyan-300">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
