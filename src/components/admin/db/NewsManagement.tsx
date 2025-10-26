/**
 * News Management Component (Database-driven, Mobile-optimized)
 * Complete CRUD interface for news articles
 */

'use client';

import { useState, useEffect } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string | null;
  published_date: string;
  category: string | null;
  icon: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  date_confidence: number | null;
  needs_review: boolean;
  review_priority: string | null;
}

export default function NewsManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [manualDate, setManualDate] = useState('');

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/db/news?status=published&limit=100', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data.data || []);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Submit new article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/db/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, featured, manualDate: manualDate || undefined }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add article');
      }

      setSuccess(data.message || 'Article added successfully!');
      setUrl('');
      setFeatured(false);
      setManualDate('');
      setShowForm(false);

      // Refresh article list
      setTimeout(() => fetchArticles(), 500);

    } catch (err: any) {
      setError(err.message || 'Failed to add article');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/db/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
        credentials: 'include',
      });

      if (response.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  // Delete article
  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to archive this article?')) return;

    try {
      const response = await fetch(`/api/admin/db/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSuccess('Article archived successfully');
        fetchArticles();
      }
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">News Management</h2>
          <p className="text-sm md:text-base text-gray-400 mt-1">
            {articles.length} published articles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 md:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-base md:text-sm font-medium transition-colors touch-manipulation"
        >
          {showForm ? '✕ Close' : '+ Add Article'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-500 text-green-100 px-4 py-3 rounded-lg">
          <p className="font-medium">Success</p>
          <p className="text-sm mt-1">{success}</p>
        </div>
      )}

      {/* Add Article Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h3 className="text-xl font-bold text-white mb-4">Add News Article</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input - Mobile optimized */}
            <div>
              <label htmlFor="url" className="block text-base md:text-sm font-medium text-cyan-100 mb-2">
                Article URL *
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://techcrunch.com/article..."
                required
                disabled={isSubmitting}
                className="w-full px-4 py-4 md:py-3 text-base md:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 touch-manipulation"
                style={{ fontSize: '16px' }} // Prevents zoom on iOS
              />
              <p className="text-xs text-gray-400 mt-2">
                🤖 AI will automatically extract title, source, date, and summary
              </p>
            </div>

            {/* Manual Date (Optional) */}
            <div>
              <label htmlFor="manualDate" className="block text-base md:text-sm font-medium text-cyan-100 mb-2">
                Publication Date (optional)
              </label>
              <input
                type="date"
                id="manualDate"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-4 md:py-3 text-base md:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              <p className="text-xs text-gray-400 mt-2">
                Leave blank to auto-detect from article
              </p>
            </div>

            {/* Featured Checkbox - Larger for mobile */}
            <div className="flex items-start gap-3 bg-gray-700/50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                disabled={isSubmitting}
                className="h-6 w-6 md:h-5 md:w-5 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700 mt-0.5"
              />
              <div>
                <label htmlFor="featured" className="block text-base md:text-sm font-medium text-cyan-100 cursor-pointer">
                  Feature this article
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Featured articles appear in highlighted sections
                </p>
              </div>
            </div>

            {/* Submit Button - Full width on mobile */}
            <button
              type="submit"
              disabled={isSubmitting || !url}
              className="w-full px-6 py-4 md:py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg text-base md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                '🤖 Add Article'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-bold text-white">Published Articles</h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-lg">📰 No articles yet</p>
            <p className="text-gray-500 text-sm mt-2">Add your first article using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-800 rounded-lg p-4 md:p-5 border border-gray-700 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h4 className="font-medium text-white text-base md:text-lg flex-1 leading-snug">
                    {article.icon} {article.title}
                  </h4>
                  {article.featured && (
                    <span className="text-xs bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded border border-yellow-600/50 whitespace-nowrap">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p>📰 {article.source}</p>
                  <p>📅 {new Date(article.published_date).toLocaleDateString()}</p>
                  {article.category && <p>🏷️ {article.category}</p>}
                  {article.needs_review && (
                    <p className="text-yellow-400">
                      ⚠️ Needs Review ({article.review_priority})
                      {article.date_confidence !== null && ` - ${article.date_confidence}% confidence`}
                    </p>
                  )}
                </div>

                {/* Mobile-friendly action buttons */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] px-4 py-2.5 md:py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-lg text-sm transition-colors touch-manipulation"
                  >
                    🔗 View Article
                  </a>
                  <button
                    onClick={() => toggleFeatured(article.id, article.featured)}
                    className="px-4 py-2.5 md:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors touch-manipulation"
                  >
                    {article.featured ? '⭐ Unfeature' : '⭐ Feature'}
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="px-4 py-2.5 md:py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-lg text-sm transition-colors touch-manipulation"
                  >
                    🗑️ Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
