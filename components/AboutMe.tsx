import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the type for the About Me content
interface AboutMeContent {
  title: string;
  headline: string;
  image: string;
  bio_paragraphs: string[];
}

// Function to get the content from the markdown file
function getAboutMeContent(): AboutMeContent {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content', 'sections', 'about_me.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the markdown file
    const { data } = matter(fileContents);
    
    return data as AboutMeContent;
  } catch (error) {
    console.error('Error loading About Me content:', error);
    
    // Return default content if there's an error
    return {
      title: 'About Deven',
      headline: 'About Deven',
      image: '/DKS_Future_head.JPG',
      bio_paragraphs: [
        "Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity. With deep expertise across real estate development, emerging tech (AI, Blockchain, Web3), and wellness innovation, he builds ventures that bridge physical and digital worlds.",
        "From smart homes to sacred geometry, from SaaS to spiritual systems, Deven sees the big picture and engineers what's next. He's the rare leader who fuses engineering precision with creative intuition—and delivers."
      ]
    };
  }
}

export default function AboutMe() {
  // Get the content from the markdown file
  const content = getAboutMeContent();
  
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
