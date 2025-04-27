"use client";

import React from 'react';
import Image from 'next/image';
import { defaultAboutFutureFastContent, AboutFutureFastContent } from '../lib/content';

// Use the default content directly in the client component
// This will be replaced with server-side data fetching in a future update
const content: AboutFutureFastContent = defaultAboutFutureFastContent;

export default function AboutWithSubscription() {
  // Google Form ID
  const formId = '1FAIpQLSfvKmVdVXcZ1H7_e29KGaBYCQwsa313Ene5vmlzgGNTmV333g';
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/viewform`;
  
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
            <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
              <p className="text-lg text-purple-100 mb-6">
                Sign up below to be added to our mailing list. You will receive updates and be invited to more content like this.
              </p>
              
              {/* Styled button that links to Google Form */}
              <div className="w-full rounded-xl overflow-hidden bg-gray-800 p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Join Our Mailing List</h3>
                <p className="text-gray-300 mb-6">
                  Get exclusive updates, early access to resources, and invitations to special events.
                </p>
                <a 
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 shadow-lg"
                >
                  Subscribe Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
