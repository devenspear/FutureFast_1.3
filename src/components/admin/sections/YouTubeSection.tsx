'use client';

import { useState } from 'react';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { YouTubeVideoItem } from '../../../types/youtube';

interface YouTubeSectionProps {
  videos: YouTubeVideoItem[];
  categories: string[];
}

export default function YouTubeSection({ videos, categories }: YouTubeSectionProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Interview');
  const [featured, setFeatured] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Default categories if none provided
  const availableCategories = categories.length > 0 ? categories : [
    'Interview',
    'AI & Future of Work',
    'Web3 & Blockchain',
    'Robotics & Manufacturing',
    'Quantum Computing',
    'VR & Metaverse',
    'Tech Innovation',
    'Digital Strategy',
    'Emerging Tech'
  ];
  
  const { handleSubmit, isSubmitting, error, successMessage } = useFormSubmit(
    async (formData: { url: string; category: string; featured: boolean; id?: string }) => {
      console.log('🚀 [YouTubeSection] Starting video submission:', formData);
      
      const endpoint = editingVideo ? '/api/admin/youtube/update' : '/api/admin/youtube/add';
      console.log('🔗 [YouTubeSection] API endpoint:', endpoint);
      
      // Check if we have auth cookies before making the request
      const allCookies = document.cookie;
      console.log('🍪 [YouTubeSection] All cookies:', allCookies);
      const authToken = document.cookie.split(';').find(c => c.trim().startsWith('auth-token='));
      console.log('🔑 [YouTubeSection] Auth token found:', !!authToken);
      if (authToken) {
        console.log('🔑 [YouTubeSection] Auth token preview:', authToken.substring(0, 50) + '...');
      }
      
      const requestBody = editingVideo ? {...formData, id: editingVideo.id} : formData;
      console.log('📦 [YouTubeSection] Request body:', requestBody);
      
      console.log('📡 [YouTubeSection] Making fetch request with credentials: include');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });
      
      console.log('📬 [YouTubeSection] Response status:', response.status);
      console.log('📬 [YouTubeSection] Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        let errorData;
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const responseText = await response.text();
          console.log('📄 [YouTubeSection] Raw response text:', responseText);
          
          // Try to parse as JSON
          if (responseText.trim().startsWith('{')) {
            errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } else {
            // If not JSON, use the raw text
            errorMessage = responseText || errorMessage;
          }
        } catch (parseError) {
          console.error('🔧 [YouTubeSection] Error parsing response:', parseError);
          errorMessage = `Server error (${response.status}): Unable to parse response`;
        }
        
        console.error('❌ [YouTubeSection] API error response:', errorData || errorMessage);
        console.error('❌ [YouTubeSection] Full response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: errorData || errorMessage
        });
        
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('✅ [YouTubeSection] Success response:', responseData);
      return responseData;
    },
    () => {
      // Reset form on success
      setUrl('');
      setCategory(availableCategories[0]);
      setFeatured(false);
      setEditingVideo(null);
      setShowForm(false);
    },
    (error) => {
      console.error(`Error ${editingVideo ? 'updating' : 'adding'} YouTube video:`, error);
    },
    editingVideo 
      ? 'YouTube video updated successfully!'
      : 'YouTube video added successfully! Metadata will be fetched automatically.'
  );
  
  // Function to handle video deletion
  const handleDelete = async (videoId: string) => {
    if (!videoId) return;
    
    try {
      setIsDeleting(true);
      setDeleteId(videoId);
      
      const response = await fetch('/api/admin/youtube/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: videoId }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete YouTube video');
      }
      
      // Reload the page to refresh the video list
      window.location.reload();
      
    } catch (error) {
      console.error('Error deleting YouTube video:', error);
      alert('Failed to delete video. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  
  // Function to set up editing a video
  const startEditing = (video: YouTubeVideoItem) => {
    setEditingVideo(video);
    setUrl(video.url || '');
    setCategory(video.category || availableCategories[0]);
    setFeatured(video.featured || false);
    setShowForm(true);
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ 
      url, 
      category, 
      featured, 
      ...(editingVideo && editingVideo.id ? { id: editingVideo.id } : {})
    });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">YouTube Video Management</h2>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              console.log('🔍 [Debug] Testing auth debug endpoint');
              try {
                const response = await fetch('/api/admin/auth/debug', {
                  credentials: 'include'
                });
                const data = await response.json();
                console.log('🔍 [Debug] Auth debug response:', data);
                alert('Debug info logged to console. Check browser dev tools.');
              } catch (error) {
                console.error('🔍 [Debug] Auth debug failed:', error);
                alert('Debug failed. Check console for details.');
              }
            }}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
          >
            🔍 Debug Auth
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add New Video'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium text-cyan-100 mb-4">Add YouTube Video</h3>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}
            
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-cyan-100 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="mt-1 text-sm font-sans text-gray-400">
                Paste the full YouTube URL (supports youtube.com and youtu.be formats)
              </p>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-cyan-100 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="featured" className="ml-2 block text-sm font-sans text-cyan-100">
                Feature this video (will appear in highlighted sections)
              </label>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-sans px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Adding...' : 'Add YouTube Video'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-cyan-100 mb-4">Existing Videos ({videos.length})</h3>
        
        {videos.length === 0 ? (
          <p className="text-gray-400">No videos found. Add your first video above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort videos by publishedAt date (newest first) */}
            {[...videos]
              .sort((a, b) => {
                // If both have publishedAt dates, compare them
                if (a.publishedAt && b.publishedAt) {
                  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                }
                // If only one has a publishedAt date, prioritize the one with a date
                if (a.publishedAt) return -1;
                if (b.publishedAt) return 1;
                // If neither has a publishedAt date, keep original order
                return 0;
              })
              .map((video, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                {/* Title with pending indicator if needed */}
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-white line-clamp-1">
                    {video.title.includes('[Pending') ? (
                      <span className="text-amber-400">{video.title}</span>
                    ) : (
                      video.title
                    )}
                  </h4>
                  
                  {/* Status badge */}
                  {video.title.includes('[Pending') ? (
                    <span className="bg-amber-900/30 text-amber-300 text-xs px-2 py-1 rounded">
                      Pending
                    </span>
                  ) : video.featured ? (
                    <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  ) : null}
                </div>
                
                <p className="text-sm text-gray-400 mb-2">Category: {video.category}</p>
                {video.channelName && (
                  <p className="text-sm text-gray-400 mb-1">Channel: {video.channelName}</p>
                )}
                {video.publishedAt && (
                  <p className="text-sm text-gray-400 mb-1">Published: {new Date(video.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                )}
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{video.description}</p>
                
                {/* Actions row */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {/* View on YouTube link - only show if not pending */}
                    {!video.title.includes('[Pending') && video.url ? (
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        View on YouTube
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">URL needed</span>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    {/* Replace button for pending videos */}
                    {video.title.includes('[Pending') ? (
                      <button
                        onClick={() => {
                          // Pre-fill the form with the pending video's category and featured status
                          setCategory(video.category || availableCategories[0]);
                          setFeatured(video.featured || false);
                          setUrl('');
                          setShowForm(true);
                          // Scroll to form
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                      >
                        Replace
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(video)}
                        className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    
                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
                          // Use a dummy ID for pending videos since they don't have real IDs
                          const videoId = video.title.includes('[Pending') 
                            ? `pending-${index}` 
                            : video.id || `video-${index}`;
                          handleDelete(videoId);
                        }
                      }}
                      disabled={isDeleting && deleteId === video.id}
                      className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
                    >
                      {isDeleting && deleteId === video.id ? 'Deleting...' : 'Delete'}
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
