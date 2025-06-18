"use client";
import React, { useState, useEffect } from 'react';
import NewsListSection from '../../../components/NewsListSection';

interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  featured?: boolean;
}

export default function NotionNewsTestPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotionNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/notion-news');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch news');
        }
        
        const data = await response.json();
        
        // Transform the data to match NewsListSection expected format
        const transformedNews = data.map((item: any) => ({
          title: item.title,
          source: item.source,
          url: item.url,
          publishedDate: new Date(item.date).toISOString(),
          featured: item.featured || false,
        }));
        
        setNewsItems(transformedNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching Notion news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotionNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Modern Loading Animation */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 animate-spin animate-reverse" style={{animationDuration: '1.5s'}}></div>
            </div>
            <h2 className="text-2xl font-orbitron font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Loading Latest News
            </h2>
            <p className="text-gray-400 animate-pulse">Fetching from Notion database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-lg">
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">⚠️</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-orbitron font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Connection Issue
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">{error}</p>
            
            {/* Enhanced Setup Instructions */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
              <h3 className="font-orbitron font-semibold mb-6 text-cyan-400 text-xl">Quick Setup Checklist:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Create Notion integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Add NOTION_TOKEN to .env.local</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Add NOTION_DATABASE_ID</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Share database with integration</span>
                </div>
              </div>
            </div>
            
            {/* Modern Retry Button */}
            <button 
              onClick={() => window.location.reload()} 
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              <span className="relative z-10">Retry Connection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header Section */}
      <div className="relative pt-20 pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live from Notion</span>
            </div>
            
            {/* Main Title */}
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Latest News Feed
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time news updates powered by Notion CMS
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-cyan-400">{newsItems.length}</div>
                <div className="text-sm text-gray-400">Latest Articles</div>
              </div>
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-purple-400">Live</div>
                <div className="text-sm text-gray-400">Data Source</div>
              </div>
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-green-400">Auto</div>
                <div className="text-sm text-gray-400">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* News Content */}
      <div className="relative">
        {newsItems.length > 0 ? (
          <div className="animate-fade-in">
            <NewsListSection newsItems={newsItems} />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-full"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl">📰</span>
              </div>
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-4">No Articles Found</h3>
            <p className="text-gray-400 text-lg">Add some published articles to your Notion database to see them here</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-full">
              <span className="text-gray-400 text-sm mr-2">Powered by</span>
              <span className="text-white font-semibold">Notion API</span>
              <span className="ml-2 text-xl">⚡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add custom CSS for additional animations
const style = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
  .animate-reverse {
    animation-direction: reverse;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
} 