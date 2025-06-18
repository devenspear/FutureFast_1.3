"use client";
import React, { useState, useEffect } from 'react';
import NewsListSection from './NewsListSection';

interface NotionNewsItem {
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  featured?: boolean;
}

interface NotionNewsSectionProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
  fallbackToSample?: boolean;
}

const NotionNewsSection: React.FC<NotionNewsSectionProps> = ({ 
  limit = 5, 
  showHeader = true,
  className = "",
  fallbackToSample = true 
}) => {
  const [newsItems, setNewsItems] = useState<NotionNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotionNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/notion-news');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news from Notion');
        }
        
        const data = await response.json();
        
        // Transform the data to match NewsListSection expected format
        const transformedNews = data
          .slice(0, limit) // Limit results
          .map((item: any) => ({
            title: item.title,
            source: item.source,
            url: item.url,
            publishedDate: new Date(item.date).toISOString(),
            featured: item.featured || false,
          }));
        
        setNewsItems(transformedNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
        console.error('Error fetching Notion news:', err);
        
        // Fallback to sample data if enabled and no items loaded
        if (fallbackToSample && newsItems.length === 0) {
          // Use sample data from NewsListSection as fallback
          setNewsItems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotionNews();
  }, [limit, fallbackToSample]);

  // Loading state
  if (loading) {
    return (
      <section className={`py-16 bg-black text-white relative overflow-hidden ${className}`}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          {showHeader && (
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
              In The News
            </h1>
          )}
          
          <div className="max-w-5xl mx-auto px-4">
            <div className="space-y-6">
              {[...Array(3)].map((_, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-900/40 rounded-2xl p-8 animate-pulse"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-gray-700/50 rounded-lg w-3/4"></div>
                      <div className="flex gap-6">
                        <div className="h-4 bg-gray-700/30 rounded w-24"></div>
                        <div className="h-4 bg-gray-700/30 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gray-700/30 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state - silently fallback to NewsListSection with sample data
  if (error) {
    console.warn('Notion news failed to load, falling back to sample data:', error);
    return <NewsListSection newsItems={[]} />;
  }

  // Success state - use Notion data
  return (
    <div className={className}>
      <NewsListSection newsItems={newsItems} />
    </div>
  );
};

export default NotionNewsSection; 