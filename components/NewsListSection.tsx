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
    <section className="py-16 bg-black text-white" id="in-the-news">
      <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">In The News</h1>
      
      <div className="max-w-4xl mx-auto px-4">
        <ul className="divide-y divide-gray-800">
          {newsItems.map((item, idx) => {
            // Parse the date
            const date = new Date(item.publishedDate);
            const formattedDate = format(date, 'MMM d, yyyy');
            
            return (
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
                        <span>{formattedDate}</span>
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
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default NewsListSection;
