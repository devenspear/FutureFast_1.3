"use client";

import React from 'react';
import Image from 'next/image';
import { defaultAboutFutureFastContent, AboutFutureFastContent } from '../lib/content';
import SubscriptionForm from './SubscriptionForm';

// Use the default content directly in the client component
// This will be replaced with server-side data fetching in a future update
const content: AboutFutureFastContent = defaultAboutFutureFastContent;

export default function AboutWithSubscription() {
  return (
    <section className="py-16 bg-black text-white" id="about">
      <div className="container mx-auto px-4">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-10 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          {content.headline}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* About content - Left side */}
          <div className="flex-1">
            <div className="relative">
              <div className="space-y-4 text-lg text-gray-300">
                {content.bio_paragraphs.slice(0, Math.ceil(content.bio_paragraphs.length / 2)).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                
                <div className="relative">
                  {/* Float image to the right in the text */}
                  <div className="float-right ml-6 mb-4 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center">
                    <Image
                      src={content.image}
                      alt="FutureFast"
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Remaining paragraphs wrap around the image */}
                  {content.bio_paragraphs.slice(Math.ceil(content.bio_paragraphs.length / 2)).map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription form - Right side */}
          <div className="lg:w-2/5">
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </section>
  );
}
