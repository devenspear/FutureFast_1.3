"use client";
import React from 'react';
import { FaExternalLinkAlt, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { format } from 'date-fns';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedDate: string; // ISO format date
  featured?: boolean;
}

// Sample news items for development/preview
const sampleNewsItems: NewsItem[] = [
  {
    title: 'AI Breakthroughs in 2025: What Business Leaders Need to Know',
    source: 'TechCrunch',
    url: 'https://techcrunch.com/ai-breakthroughs-2025',
    publishedDate: '2025-01-15T09:30:00.000Z',
    featured: true,
  },
  {
    title: 'Web3 Technologies Reshape Global Real Estate Markets',
    source: 'Forbes',
    url: 'https://forbes.com/web3-real-estate-markets',
    publishedDate: '2024-11-28T14:15:00.000Z',
  },
  {
    title: 'Robotics Revolution: How Automation is Changing Daily Life',
    source: 'MIT Technology Review',
    url: 'https://technologyreview.mit.edu/robotics-everyday-impact',
    publishedDate: '2024-09-05T11:45:00.000Z',
  },
  {
    title: 'The Future of Work: AI and Human Collaboration',
    source: 'Harvard Business Review',
    url: 'https://hbr.org/future-of-work-ai-collaboration',
    publishedDate: '2024-12-10T08:00:00.000Z',
  },
  {
    title: 'Quantum Computing Breakthrough Could Accelerate AI Development',
    source: 'Nature',
    url: 'https://nature.com/quantum-computing-ai',
    publishedDate: '2025-02-20T10:30:00.000Z',
  }
];

interface NewsListProps {
  newsItems?: NewsItem[];
}

const NewsListSection: React.FC<NewsListProps> = ({ newsItems = sampleNewsItems }) => {
  return (
    <section className="py-16 bg-black text-white relative overflow-hidden" id="in-the-news">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          In The News
        </h1>
        
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-6">
            {newsItems.map((item, idx) => {
              // Parse the date
              const date = new Date(item.publishedDate);
              const formattedDate = format(date, 'MMM d, yyyy');
              
              return (
                <article 
                  key={idx} 
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    item.featured 
                      ? 'bg-gradient-to-r from-cyan-900/20 via-gray-900/40 to-purple-900/20 border border-cyan-500/30' 
                      : 'bg-gray-900/40 hover:bg-gray-900/60 border border-gray-800/50 hover:border-gray-700/50'
                  } backdrop-blur-sm`}
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Featured
                      </div>
                    </div>
                  )}
                  
                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse"></div>
                  </div>
                  
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative z-10 block p-8 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="flex-1 space-y-4">
                        {/* Title */}
                        <h2 className="text-xl lg:text-2xl font-bold leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                          {item.title}
                        </h2>
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">
                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                              <FaNewspaper className="text-cyan-500" />
                            </div>
                            <span className="font-medium">{item.source}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                              <FaCalendarAlt className="text-purple-500" />
                            </div>
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Area */}
                      <div className="flex items-center justify-center lg:justify-end">
                        <div className="relative group/button">
                          <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110">
                            <FaExternalLinkAlt className="text-cyan-400 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                            Read Article
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
          
          {/* Bottom Gradient Effect */}
          <div className="mt-16 text-center">
            <div className="inline-block p-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-full">
              <div className="text-gray-400 text-sm">
                Stay updated with the latest in technology and innovation
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        article {
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default NewsListSection;
