'use client';

import { useState, useEffect } from 'react';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { NewsItem } from '../../../../lib/content-loader';

interface NewsSectionProps {
  newsItems: NewsItem[];
}

export default function NewsSection({ newsItems: initialNewsItems }: NewsSectionProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [url, setUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [manualDate, setManualDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  const [autoDeployed, setAutoDeployed] = useState(false);
  
  // Function to refresh news items from the API
  const refreshNewsItems = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/news');
      if (response.ok) {
        const freshNewsData = await response.json();
        // Transform API data to match admin interface format
        const transformedNews = freshNewsData.map((item: any) => ({
          title: item.title,
          source: item.source,
          url: item.url,
          publishedDate: item.date || item.publishedDate, // Handle both field names
          featured: item.featured || false,
        }));
        setNewsItems(transformedNews);
      }
    } catch (error) {
      console.error('Error refreshing news items:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh on component mount and when page becomes visible
  useEffect(() => {
    refreshNewsItems();

    // Refresh when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshNewsItems();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const { handleSubmit, isSubmitting, error, successMessage } = useFormSubmit(
    async (formData: { url: string; featured: boolean; manualDate?: string }) => {
      const response = await fetch('/api/admin/news/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add news article');
      }
      
      const data = await response.json();
      
      // Handle different response types
      if (data.autoDeployed) {
        setAutoDeployed(true);
        setGeneratedMarkdown('');
      } else if (data.requiresManualCreation && data.metadata.markdownContent) {
        setAutoDeployed(false);
        setGeneratedMarkdown(data.metadata.markdownContent);
      } else if (data.metadata) {
        // For backward compatibility, generate markdown if needed
        setAutoDeployed(false);
        const markdownContent = `---
title: "${data.metadata.title.replace(/"/g, '\"')}"
url: "${formData.url}"
source: "${data.metadata.source.replace(/"/g, '\"')}"
publishedDate: "${data.metadata.publishedDate}"
featured: ${formData.featured}
summary: "${data.metadata.summary.replace(/"/g, '\"')}"
tags: [${data.metadata.tags.map((tag: string) => `"${tag.replace(/"/g, '\"')}"`).join(', ')}]
---

${data.metadata.summary}

[Read the full article](${formData.url})
`;
        setGeneratedMarkdown(markdownContent);
      }
      
      return data;
    },
    () => {
      // Reset form on success and refresh news list
      setUrl('');
      setFeatured(false);
      // Refresh the news list to show the newly added article
      setTimeout(() => refreshNewsItems(), 1000);
    },
    (error) => {
      console.error('Error adding news article:', error);
      setAutoDeployed(false);
      setGeneratedMarkdown('');
    },
    '' // We'll set the success message dynamically
  );
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAutoDeployed(false);
    setGeneratedMarkdown('');
    handleSubmit({ url, featured, manualDate: manualDate || undefined });
  };
  
  // Dynamic success message based on deployment status
  const getSuccessMessage = () => {
    if (autoDeployed) {
      return 'News article created and automatically deployed! Your website will update in 1-2 minutes.';
    } else if (generatedMarkdown) {
      return 'News article metadata generated! See instructions below.';
    } else if (successMessage) {
      return successMessage;
    }
    return '';
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">News Article Management</h2>
          {isRefreshing && (
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
              <span>Refreshing...</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshNewsItems}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-md text-sm transition-colors flex items-center gap-2"
          >
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
            Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add News Article'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium text-cyan-100 mb-4">Add News Article</h3>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 text-white p-4 rounded-md mb-4">
                <p className="font-medium">❌ Error:</p>
                <p>{error.toString()}</p>
                {error.toString().includes('Authentication required') && (
                  <p className="mt-2 text-sm">
                                         💡 <strong>Action needed:</strong> Please ensure you&apos;re logged in to the admin interface.
                  </p>
                )}
                {error.toString().includes('GITHUB_TOKEN') && (
                  <p className="mt-2 text-sm">
                    💡 <strong>Action needed:</strong> GitHub environment variables need to be configured in Vercel.
                  </p>
                )}
              </div>
            )}
            
            {getSuccessMessage() && (
              <div className={`text-white p-4 rounded-md mb-4 ${autoDeployed ? 'bg-green-800' : 'bg-blue-800'}`}>
                <p className="font-medium">
                  {autoDeployed ? '✅ Auto-Deployed!' : '⚠️ Manual Action Required'}
                </p>
                <p>{getSuccessMessage()}</p>
                
                {autoDeployed && (
                  <div className="mt-3 p-3 bg-green-900/50 rounded border border-green-600">
                    <p className="text-sm font-medium text-green-300">🚀 Deployment Status:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>✅ File automatically created in GitHub repository</li>
                      <li>✅ Vercel deployment triggered automatically</li>
                      <li>⏳ Website will update within 1-2 minutes</li>
                      <li>🔍 Check your live website to see the new article</li>
                    </ul>
                  </div>
                )}
                
                {generatedMarkdown && !autoDeployed && (
                  <div className="mt-4">
                    <p className="text-sm mb-2 font-medium">
                                             📋 Manual deployment required - copy this markdown and save it as a .md file in your repository&apos;s content/news directory:
                    </p>
                    <div className="relative">
                      <pre className="bg-gray-900 p-3 rounded text-xs overflow-auto max-h-60 border border-gray-600">
                        {generatedMarkdown}
                      </pre>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedMarkdown);
                          alert('✅ Markdown copied to clipboard!');
                        }}
                        className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p className="text-xs mt-2 text-gray-300">
                      💡 <strong>Filename suggestion:</strong> {new Date().toISOString().split('T')[0]}-article.md
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="news-url" className="block text-sm font-medium text-cyan-100 mb-1">
                News Article URL
              </label>
              <input
                type="url"
                id="news-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="mt-1 text-sm font-sans text-gray-400">
                Paste the full URL to the news article. AI will generate a title and summary automatically.
              </p>
            </div>
            
            <div>
              <label htmlFor="news-date" className="block text-sm font-medium text-cyan-100 mb-1">Publication Date (optional)</label>
              <input
                type="date"
                id="news-date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="mt-1 text-sm font-sans text-gray-400">Leave blank to auto-detect.</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="news-featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="news-featured" className="ml-2 block text-sm font-sans text-cyan-100">
                Feature this article (will appear in highlighted sections)
              </label>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-sans px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Article...
                  </span>
                ) : (
                  '🤖 Add News Article'
                )}
              </button>
            </div>
            
            <div className="mt-4 text-sm font-sans text-gray-400 bg-gray-900/50 p-3 rounded border border-gray-700">
              <p className="font-medium text-cyan-200 mb-2">🎯 How this works:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>AI visits the URL and extracts the article content automatically</li>
                <li>System generates title, source, publication date, and summary</li>
                <li>Article is automatically deployed to your live website (if configured)</li>
                <li>No manual file editing or git commands required!</li>
              </ul>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-cyan-100 mb-4">Existing News Articles ({newsItems.length})</h3>
        
        {newsItems.length === 0 ? (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 mb-2">📰 No news articles found</p>
            <p className="text-sm text-gray-500">Add your first article using the form above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...newsItems]
              .sort((a, b) => {
                return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
              })
              .map((article, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
                <h4 className="font-medium text-white mb-1 line-clamp-2">{article.title}</h4>
                <p className="text-sm text-gray-400 mb-1">📰 Source: {article.source}</p>
                <p className="text-sm text-gray-400 mb-3">
                  📅 Published: {new Date(article.publishedDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                  >
                    🔗 View Article
                  </a>
                  {article.featured && (
                    <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 rounded border border-yellow-600/50">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
