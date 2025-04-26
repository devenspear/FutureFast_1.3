import React from 'react';
import Image from 'next/image';
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
  }
];

export default function NewsAndDisruptionSection() {
  return (
    <section className="py-16 bg-black text-white" id="news-and-disruption">
      <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">In The News</h1>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* Disruption Weekly - Left Side */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <a
            href="https://www.linkedin.com/newsletters/disruption-weekly-7120892654304776192/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-md mx-auto group"
          >
            <div className="relative overflow-hidden rounded-xl border-2 border-cyan-400 shadow-lg transition-all duration-300 group-hover:shadow-cyan-500/30 group-hover:shadow-xl">
              <Image
                src="/images/DisWeekly_Banner.jpg"
                alt="Disruption Weekly Banner"
                width={500}
                height={300}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h2 className="text-2xl font-bold text-white mb-2">Disruption Weekly</h2>
                  <p className="text-sm text-gray-200 mb-3">
                    Explore the latest insights and trends on our LinkedIn newsletter.
                  </p>
                  <span className="inline-flex items-center text-cyan-400 text-sm font-semibold">
                    Visit on LinkedIn <FaExternalLinkAlt className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
        
        {/* News Articles - Right Side */}
        <div className="lg:w-1/2">
          <ul className="divide-y divide-gray-800">
            {newsItems.map((item, idx) => (
              <li 
                key={idx} 
                className={`py-4 transition-all duration-200 hover:bg-gray-900 px-3 rounded-lg ${
                  item.featured ? 'border-l-4 border-cyan-500' : ''
                }`}
              >
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col md:flex-row md:items-center gap-2 w-full group"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center mt-1 text-xs text-gray-400 gap-3">
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
      </div>
    </section>
  );
}
