/**
 * YouTube Management Component (Database-driven, Mobile-optimized)
 * Complete CRUD interface for YouTube videos
 */

'use client';

import { useState, useEffect } from 'react';

interface YouTubeVideo {
  id: string;
  video_id: string;
  url: string;
  title: string;
  description: string | null;
  channel: string | null;
  thumbnail_url: string | null;
  category: string | null;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  published_date: string | null;
  created_at: string;
}

const CATEGORIES = [
  'Interview',
  'AI & Future of Work',
  'Web3 & Blockchain',
  'Robotics & Manufacturing',
  'Quantum Computing',
  'VR & Metaverse',
  'Tech Innovation',
  'Digital Strategy',
  'Emerging Tech',
];

export default function YouTubeManagement() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Interview');
  const [featured, setFeatured] = useState(false);

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/db/youtube?status=published&limit=100', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data.data || []);
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Submit new video
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/db/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, category, featured }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add video');
      }

      setSuccess(data.message || 'Video added successfully!');
      setUrl('');
      setCategory('Interview');
      setFeatured(false);
      setShowForm(false);

      // Refresh video list
      setTimeout(() => fetchVideos(), 500);

    } catch (err: any) {
      setError(err.message || 'Failed to add video');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/db/youtube/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
        credentials: 'include',
      });

      if (response.ok) {
        fetchVideos();
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  // Delete video
  const deleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to archive this video?')) return;

    try {
      const response = await fetch(`/api/admin/db/youtube/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSuccess('Video archived successfully');
        fetchVideos();
      }
    } catch (err) {
      setError('Failed to delete video');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">YouTube Management</h2>
          <p className="text-sm md:text-base text-gray-400 mt-1">
            {videos.length} published videos
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 md:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-base md:text-sm font-medium transition-colors touch-manipulation"
        >
          {showForm ? '✕ Close' : '+ Add Video'}
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

      {/* Add Video Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h3 className="text-xl font-bold text-white mb-4">Add YouTube Video</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input - Mobile optimized */}
            <div>
              <label htmlFor="url" className="block text-base md:text-sm font-medium text-cyan-100 mb-2">
                YouTube URL *
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                disabled={isSubmitting}
                className="w-full px-4 py-4 md:py-3 text-base md:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 touch-manipulation"
                style={{ fontSize: '16px' }} // Prevents zoom on iOS
              />
              <p className="text-xs text-gray-400 mt-2">
                🤖 Metadata will be auto-fetched from YouTube API
              </p>
            </div>

            {/* Category Selector - Larger for mobile */}
            <div>
              <label htmlFor="category" className="block text-base md:text-sm font-medium text-cyan-100 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-4 md:py-3 text-base md:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 touch-manipulation"
                style={{ fontSize: '16px' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                  Feature this video
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Featured videos appear in highlighted sections
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
                '🎥 Add Video'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-bold text-white">Published Videos</h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-lg">🎥 No videos yet</p>
            <p className="text-gray-500 text-sm mt-2">Add your first video using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-colors"
              >
                {/* Thumbnail */}
                {video.thumbnail_url && (
                  <div className="aspect-video bg-gray-900">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h4 className="font-medium text-white text-base md:text-lg flex-1 leading-snug">
                      {video.title}
                    </h4>
                    {video.featured && (
                      <span className="text-xs bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded border border-yellow-600/50 whitespace-nowrap">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <p>📺 {video.channel || 'YouTube'}</p>
                    {video.category && <p>🏷️ {video.category}</p>}
                    <p>🆔 {video.video_id}</p>
                  </div>

                  {/* Mobile-friendly action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] px-4 py-2.5 md:py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-lg text-sm transition-colors touch-manipulation"
                    >
                      🔗 Watch Video
                    </a>
                    <button
                      onClick={() => toggleFeatured(video.id, video.featured)}
                      className="px-4 py-2.5 md:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors touch-manipulation"
                    >
                      {video.featured ? '⭐ Unfeature' : '⭐ Feature'}
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="px-4 py-2.5 md:py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-lg text-sm transition-colors touch-manipulation"
                    >
                      🗑️ Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
