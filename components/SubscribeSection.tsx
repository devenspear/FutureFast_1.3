"use client";

import React from 'react';
import { defaultWhyWeExistContent } from '../lib/content';

// Use the default content directly in the client component
// This will be replaced with server-side data fetching in a future update
const content = defaultWhyWeExistContent;

export default function SubscribeSection() {
  return (
    <section className="py-16 bg-black text-white text-center px-4" id="about">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-8 mt-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent break-words">
          {content.headline}
        </h1>
        <p className="mb-10 text-lg md:text-xl text-purple-100 font-medium">
          {content.main_text.includes('FutureFaster.ai') ? (
            <>
              {content.main_text.split('FutureFaster.ai')[0]}
              <span className="text-purple-400 font-bold">FutureFaster.ai</span>
              {content.main_text.split('FutureFaster.ai')[1]}
            </>
          ) : content.main_text}
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* What We Deliver */}
          <div className="bg-gray-900/70 rounded-xl p-6 shadow border border-purple-700/20">
            <h3 className="text-2xl font-bold mb-3 text-cyan-300">What We Deliver</h3>
            <ul className="list-disc ml-5 space-y-2 text-purple-100">
              {content.what_we_deliver.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold text-white">{item.title}</span> – {item.description}
                </li>
              ))}
            </ul>
          </div>
          {/* How We&apos;re Different */}
          <div className="bg-gray-900/70 rounded-xl p-6 shadow border border-pink-700/20">
            <h3 className="text-2xl font-bold mb-3 text-pink-300">How We&apos;re Different</h3>
            <ul className="list-disc ml-5 space-y-2 text-purple-100">
              {content.how_different.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold text-white">{item.title}</span> – {item.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
