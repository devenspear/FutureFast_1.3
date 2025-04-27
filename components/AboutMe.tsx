import React from 'react';
import { defaultAboutMeContent, AboutMeContent } from '../lib/content';

// Use the default content directly in the client component
// This will be replaced with server-side data fetching in a future update
const content: AboutMeContent = defaultAboutMeContent;

export default function AboutMe() {
  return (
    <section className="py-16 bg-black text-white" id="about">
      <div className="flex flex-col md:flex-row items-center gap-10 px-4 md:px-8 md:flex-row-reverse">
        {/* Photo block */}
        <div className="flex-shrink-0 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center md:ml-8">
          {/* Use image from markdown */}
          <img
            src={content.image}
            alt="Deven Spear"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-8 mt-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent break-words w-full">
            {content.headline}
          </h1>
          {content.bio_paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className={`mb-4 ${index === 0 ? 'text-purple-200 text-lg' : 'text-gray-300'} text-center md:text-left w-full`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
