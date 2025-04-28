"use client";

import React from 'react';
import Image from 'next/image';
import { defaultAboutFutureFastContent } from '../lib/content';

// Use the default content directly
const content = defaultAboutFutureFastContent;

export default function AboutWithSubscription() {
  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gold font-orbitron bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
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
          
          {/* Subscription section - Right side */}
          <div className="lg:w-2/5">
            <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
              <p className="text-lg text-purple-100 mb-6">
                Sign up below to be added to our mailing list. You will receive updates and be invited to more content like this.
              </p>
              
              {/* Static subscription box instead of interactive form */}
              <div className="w-full rounded-xl overflow-hidden bg-gray-800 p-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Join Our Mailing List</h3>
                <p className="text-gray-300 mb-6 text-center">
                  Get exclusive updates, early access to resources, and invitations to special events.
                </p>
                
                <div className="text-center py-4 px-6 bg-purple-600 rounded-lg text-white font-medium">
                  Coming Soon - Subscribe on our website
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
