import React from 'react';
import { FaExternalLinkAlt, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';

// Sample news items
const newsItems = [
  {
    title: 'AI Breakthroughs in 2025: What Business Leaders Need to Know',
    source: 'TechCrunch',
    date: 'Jan 15, 2025',
    url: 'https://techcrunch.com/ai-breakthroughs-2025',
    featured: true,
  },
  {
    title: 'Web3 Technologies Reshape Global Real Estate Markets',
    source: 'Forbes',
    date: 'Nov 28, 2024',
    url: 'https://forbes.com/web3-real-estate-markets',
  },
  {
    title: 'Robotics Revolution: How Automation is Changing Daily Life',
    source: 'MIT Technology Review',
    date: 'Sep 5, 2024',
    url: 'https://technologyreview.mit.edu/robotics-everyday-impact',
  },
  {
    title: 'The Future of Work: AI and Human Collaboration',
    source: 'Harvard Business Review',
    date: 'Dec 10, 2024',
    url: 'https://hbr.org/future-of-work-ai-collaboration',
  },
  {
    title: 'Quantum Computing Breakthrough Could Accelerate AI Development',
    source: 'Nature',
    date: 'Feb 20, 2025',
    url: 'https://nature.com/quantum-computing-ai',
    featured: true,
  }
];

export default function InTheNewsSection() {
  return (
    <section className="py-16 bg-black text-white" id="in-the-news">
      <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">In The News</h1>
      
      <div className="max-w-4xl mx-auto px-4">
        <ul className="divide-y divide-gray-800">
          {newsItems.map((item, idx) => (
            <li 
              key={idx} 
              className={`py-5 transition-all duration-200 hover:bg-gray-900 px-4 rounded-lg ${
                item.featured ? 'border-l-4 border-cyan-500' : ''
              }`}
            >
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row md:items-center gap-3 w-full group"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center mt-2 text-sm text-gray-400 gap-4">
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
    </section>
  );
}
