"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { trackNewsClick, trackDisruptionWeeklyClick } from '../lib/analytics';

// Define the NewsItem type
interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  icon: string;
  featured?: boolean;
  excerpt?: string;
}

// Default news items as fallback
const defaultNewsItems: NewsItem[] = [
  {
    title: 'xAI&apos;s Grok chatbot can now &apos;see&apos; the world around it',
    source: 'TechCrunch',
    date: 'April 22, 2025',
    url: 'https://techcrunch.com/2025/04/22/xais-grok-chatbot-can-now-see-the-world-around-it/',
    icon: '📸',
    excerpt: 'The Grok AI chatbot from Elon Musk&apos;s startup now has vision capabilities that let it analyze and describe images...'
  },
  {
    title: 'OpenAI launches GPT-4.1 with major improvements in reasoning, memory, and tool use',
    source: 'The Decoder',
    date: 'April 20, 2025',
    url: 'https://the-decoder.com/openai-launches-gpt-4-1-new-model-family-to-improve-agents-long-contexts-and-coding/',
    icon: '✨'
  },
  {
    title: 'AI 50 2025: AI Agents Move Beyond Chat',
    source: 'Forbes',
    date: 'April 10, 2025',
    url: 'https://www.forbes.com/sites/konstantinebuhler/2025/04/10/ai-50-2025-ai-agents-move-beyond-chat/',
    icon: '✨'
  },
  {
    title: 'Runway&apos;s Gen-3 Alpha Turbo is here and can make AI videos faster than you can type',
    source: 'VentureBeat',
    date: 'April 8, 2025',
    url: 'https://venturebeat.com/ai/runways-gen-3-alpha-turbo-is-here-and-can-make-ai-videos-faster-than-you-can-type/',
    icon: '🎥'
  }
];

export default function NewsAndDisruptionSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Client-side cache key and duration (15 minutes for news)
  const CACHE_KEY = 'news_items_cache';
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Check if cached data is still valid
  const getCachedData = (): NewsItem[] | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (within 15 minutes)
      if (now - timestamp < CACHE_DURATION) {
        console.log('Using cached news data');
        return data;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error('Error reading news cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  // Save data to cache
  const setCachedData = (data: NewsItem[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('News data cached for 15 minutes');
    } catch (error) {
      console.error('Error caching news data:', error);
    }
  };
  
  useEffect(() => {
    // Fetch news items with caching
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        
        // First, try to get cached data
        const cachedNews = getCachedData();
        if (cachedNews && cachedNews.length > 0) {
          setNewsItems(cachedNews);
          setIsLoading(false);
          return;
        }

        // If no valid cache, fetch from API
        console.log('Fetching fresh news data from API');
        const response = await fetch('/api/news');
        console.log('News API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched news items:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          // Limit to 4 items for display
          const limitedItems = data.slice(0, 4);
          setCachedData(limitedItems);
          setNewsItems(limitedItems);
        } else {
          // Use default items if no data
          setNewsItems(defaultNewsItems);
        }
      } catch (error) {
        console.error('Error fetching news items:', error);
        // Use default items on error
        setNewsItems(defaultNewsItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-16 bg-black text-white" id="news-and-disruption">
      <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">In The News</h1>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* News Articles - Left Side */}
        <div className="lg:w-1/2">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="py-4 px-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ul>
              {newsItems.map((item, idx) => (
                <li 
                  key={idx} 
                  className="py-4 transition-all duration-200 hover:bg-gray-900/50 px-3 rounded-lg"
                >
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackNewsClick(item.title, item.source, item.url)}
                    className="flex flex-col md:flex-row md:items-center gap-2 w-full group"
                  >
                    <div className="flex-1">
                      <h2 className="text-lg font-bold group-hover:text-cyan-400 transition-colors">
                        {item.icon && <span className="mr-2" style={{fontSize: '1.25rem'}}>{item.icon}</span>}
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
          )}
        </div>
        
        {/* Disruption Weekly - Right Side */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Disruption Weekly</h2>
          <p className="text-center text-gray-300 mb-4">Click below to subscribe on LinkedIn</p>
          <a 
            href="https://www.linkedin.com/newsletters/disruption-weekly-7120892654304776192/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={trackDisruptionWeeklyClick}
            className="block w-full max-w-md mx-auto group"
          >
            <div className="relative overflow-hidden rounded-xl border-2 border-cyan-400 transition-all duration-300 group-hover:shadow-cyan-500/30 group-hover:shadow-xl">
              <Image
                src="/images/disruption-weekly-banner.jpg"
                alt="Disruption Weekly Newsletter"
                width={500}
                height={300}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
