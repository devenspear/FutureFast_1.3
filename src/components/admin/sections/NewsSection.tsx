'use client';

import { useState } from 'react';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { NewsItem } from '../../../../lib/content-loader';
import { useEffect } from 'react';

interface NewsSectionProps {
  newsItems: NewsItem[];
}

export default function NewsSection({ newsItems }: NewsSectionProps) {
  const [url, setUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  
  // Check if we're in production environment
  useEffect(() => {
    // In Next.js, process.env.NODE_ENV is replaced at build time
    // We can't access it directly in client components, so we'll check the hostname
    const hostname = window.location.hostname;
    setIsProduction(hostname !== 'localhost' && hostname !== '127.0.0.1');
  }, []);
  
  const { handleSubmit, isSubmitting, error, successMessage } = useFormSubmit(
    async (formData: { url: string; featured: boolean }) => {
      const response = await fetch('/api/admin/news/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add news article');
      }
      
      const data = await response.json();
      
      // If we're in production, store the generated markdown
      if (isProduction && data.metadata) {
        // Create markdown content with YAML frontmatter
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
      // Reset form on success
      setUrl('');
      setFeatured(false);
    },
    (error) => {
      console.error('Error adding news article:', error);
    },
    isProduction ? 
      'News article metadata generated! Copy the markdown below to add it to your repository.' : 
      'News article added successfully! Metadata has been generated using AI.'
  );
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ url, featured });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">News Article Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
        >
          {showForm ? 'Hide Form' : 'Add News Article'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium text-cyan-100 mb-4">Add News Article</h3>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 text-white p-4 rounded-md mb-4">
                <p>{error.toString()}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-800 text-white p-4 rounded-md mb-4">
                <p>{successMessage}</p>
                
                {isProduction && generatedMarkdown && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Copy this markdown and save it as a .md file in your repository&apos;s content/news directory:</p>
                    <div className="relative">
                      <pre className="bg-gray-900 p-3 rounded text-xs overflow-auto max-h-60">
                        {generatedMarkdown}
                      </pre>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedMarkdown);
                          alert('Markdown copied to clipboard!');
                        }}
                        className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs mt-2">Suggested filename: {new Date().toISOString().split('T')[0]}-{url.split('/').pop() || 'article'}.md</p>
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
                Paste the full URL to the news article. AI will generate a title and summary.
              </p>
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
                {isSubmitting ? 'Adding...' : 'Add News Article'}
              </button>
            </div>
            
            <div className="mt-4 text-sm font-sans text-gray-400">
              <p>When you add a news article:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                <li>AI will visit the URL and extract the article content</li>
                <li>The system will generate a title, source, and publication date</li>
                <li>The article will be added to the news section of the website</li>
              </ul>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-cyan-100 mb-4">Existing News Articles ({newsItems.length})</h3>
        
        {newsItems.length === 0 ? (
          <p className="text-gray-400">No news articles found. Add your first article above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort news articles by publishedDate (newest first) */}
            {[...newsItems]
              .sort((a, b) => {
                // Compare publication dates (newest first)
                return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
              })
              .map((article, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-1 line-clamp-2">{article.title}</h4>
                <p className="text-sm text-gray-400 mb-1">Source: {article.source}</p>
                <p className="text-sm text-gray-400 mb-3">
                  Published: {new Date(article.publishedDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    View Article
                  </a>
                  {article.featured && (
                    <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 rounded">
                      Featured
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
