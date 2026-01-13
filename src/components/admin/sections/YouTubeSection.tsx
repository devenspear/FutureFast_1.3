'use client';

import { useState } from 'react';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { YouTubeVideoItem } from '../../../types/youtube';

interface WorkflowStep {
  step: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
  timestamp: string;
}

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
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isFixingThumbnails, setIsFixingThumbnails] = useState(false);
  const [thumbnailFixResult, setThumbnailFixResult] = useState<{ success: boolean; message: string } | null>(null);

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
    'Emerging Tech',
    'Tech Conferences'
  ];

  const { handleSubmit, isSubmitting, error, successMessage } = useFormSubmit(
    async (formData: { url: string; category: string; featured: boolean; id?: string }) => {
      console.log('🚀 [YouTubeSection] Starting video submission:', formData);
      setWorkflowSteps([]);

      const endpoint = editingVideo ? '/api/admin/youtube/update' : '/api/admin/youtube/add';
      console.log('🔗 [YouTubeSection] API endpoint:', endpoint);

      const requestBody = editingVideo ? {...formData, id: editingVideo.id} : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const responseData = await response.json();
      console.log('📬 [YouTubeSection] Response:', responseData);

      // Store workflow steps for display
      if (responseData.workflowSteps) {
        setWorkflowSteps(responseData.workflowSteps);
        setShowWorkflowDetails(true);
      }

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}`);
      }

      return responseData;
    },
    () => {
      // Reset form on success
      setUrl('');
      setCategory(availableCategories[0]);
      setFeatured(false);
      setEditingVideo(null);
      // Don't hide form immediately so user can see success status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    (error) => {
      console.error(`Error ${editingVideo ? 'updating' : 'adding'} YouTube video:`, error);
    },
    'Video added successfully! It is now live on the website.'
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

  // Function to handle thumbnail fix
  const handleFixThumbnails = async () => {
    if (!confirm('This will update all video thumbnails to use the correct URL format. Continue?')) {
      return;
    }

    try {
      setIsFixingThumbnails(true);
      setThumbnailFixResult(null);

      const response = await fetch('/api/admin/fix-thumbnails', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Thumbnail fix failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Thumbnail fix result:', result);

      const { fixedCount, skippedCount, totalVideos } = result.summary;
      const message = `Thumbnails fixed! ✅ Updated: ${fixedCount} | ⏭️ Already correct: ${skippedCount} | 📁 Total: ${totalVideos}`;

      setThumbnailFixResult({
        success: true,
        message,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Thumbnail fix error:', error);
      setThumbnailFixResult({
        success: false,
        message: error instanceof Error ? error.message : 'Thumbnail fix failed',
      });
    } finally {
      setIsFixingThumbnails(false);
    }
  };

  // Function to handle database migration (for legacy markdown files)
  const handleMigration = async () => {
    if (!confirm('This will sync all videos from markdown files to the database. Continue?')) {
      return;
    }

    try {
      setIsMigrating(true);
      setMigrationResult(null);

      const response = await fetch('/api/admin/migrate-videos', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Migration failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Migration result:', result);

      const { successCount, updatedCount, skippedCount, errorCount } = result.summary;
      const message = `Migration complete! ✅ Created: ${successCount} | 🔄 Updated: ${updatedCount} | ⏭️ Skipped: ${skippedCount} | ❌ Errors: ${errorCount}`;

      setMigrationResult({
        success: true,
        message,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Migration error:', error);
      setMigrationResult({
        success: false,
        message: error instanceof Error ? error.message : 'Migration failed',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Function to set up editing a video
  const startEditing = (video: YouTubeVideoItem) => {
    setEditingVideo(video);
    setUrl(video.url || '');
    setCategory(video.category || availableCategories[0]);
    setFeatured(video.featured || false);
    setShowForm(true);
    setWorkflowSteps([]);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      alert('Please enter a valid YouTube URL. Make sure it includes the video ID (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)');
      return;
    }

    handleSubmit({
      url: url.trim(),
      category,
      featured,
      ...(editingVideo && editingVideo.id ? { id: editingVideo.id } : {})
    });
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">YouTube Video Management</h2>
        <div className="flex gap-2">
          <button
            onClick={handleFixThumbnails}
            disabled={isFixingThumbnails}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors flex items-center gap-2"
          >
            {isFixingThumbnails ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Fixing...
              </>
            ) : (
              <>🖼️ Fix Thumbnails</>
            )}
          </button>
          <button
            onClick={handleMigration}
            disabled={isMigrating}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors flex items-center gap-2"
            title="Sync legacy markdown videos to database"
          >
            {isMigrating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing...
              </>
            ) : (
              <>🔄 Sync Legacy</>
            )}
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setWorkflowSteps([]);
              setEditingVideo(null);
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add New Video'}
          </button>
        </div>
      </div>

      {/* System Info Banner */}
      <div className="mb-6 px-4 py-3 rounded border bg-gray-800/50 border-gray-700 text-gray-300">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-400">●</span>
          <span>Videos are saved directly to the database. Changes are instant - no deployment required.</span>
        </div>
      </div>

      {/* Thumbnail Fix Result Message */}
      {thumbnailFixResult && (
        <div className={`mb-6 px-4 py-3 rounded border ${
          thumbnailFixResult.success
            ? 'bg-green-900/50 border-green-500 text-green-100'
            : 'bg-red-900/50 border-red-500 text-red-100'
        }`}>
          <div className="font-medium">{thumbnailFixResult.message}</div>
          {thumbnailFixResult.success && (
            <div className="text-sm mt-1">Refreshing in 3 seconds...</div>
          )}
        </div>
      )}

      {/* Migration Result Message */}
      {migrationResult && (
        <div className={`mb-6 px-4 py-3 rounded border ${
          migrationResult.success
            ? 'bg-green-900/50 border-green-500 text-green-100'
            : 'bg-red-900/50 border-red-500 text-red-100'
        }`}>
          <div className="font-medium">{migrationResult.message}</div>
          {migrationResult.success && (
            <div className="text-sm mt-1">Refreshing in 3 seconds...</div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium text-cyan-100 mb-4">
            {editingVideo ? 'Edit YouTube Video' : 'Add YouTube Video'}
          </h3>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded">
                <div className="font-medium">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xl">✓</span>
                  <div className="font-medium">{successMessage}</div>
                </div>
              </div>
            )}

            {/* Workflow Steps Debug Panel */}
            {workflowSteps.length > 0 && (
              <div className="bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowWorkflowDetails(!showWorkflowDetails)}
                  className="w-full px-4 py-2 flex items-center justify-between text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>🔧</span>
                    <span>Workflow Details ({workflowSteps.length} steps)</span>
                  </span>
                  <span>{showWorkflowDetails ? '▼' : '▶'}</span>
                </button>

                {showWorkflowDetails && (
                  <div className="px-4 pb-4 space-y-2">
                    {workflowSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 text-sm p-2 rounded ${
                          step.status === 'success' ? 'bg-green-900/30 text-green-200' :
                          step.status === 'error' ? 'bg-red-900/30 text-red-200' :
                          'bg-yellow-900/30 text-yellow-200'
                        }`}
                      >
                        <span className="flex-shrink-0">
                          {step.status === 'success' ? '✅' : step.status === 'error' ? '❌' : '⏭️'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{step.step}</div>
                          <div className="text-xs opacity-80 break-all">{step.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-cyan-100 mb-1">
                YouTube URL *
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
              <p className="mt-1 text-sm text-gray-400">
                Supports youtube.com and youtu.be formats
              </p>
              {/* URL validation preview */}
              {url && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-sm">
                  {(() => {
                    const videoId = extractVideoId(url);
                    if (videoId) {
                      return (
                        <div className="text-green-400 flex items-center gap-2">
                          <span>✅</span>
                          <span>Valid URL - Video ID: <code className="bg-gray-700 px-1 rounded">{videoId}</code></span>
                        </div>
                      );
                    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                      return (
                        <div className="text-yellow-400">
                          ⚠️ YouTube URL detected but can&apos;t extract video ID
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-red-400">
                          ❌ Not a valid YouTube URL
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-cyan-100 mb-1">
                Category *
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
              <label htmlFor="featured" className="ml-2 block text-sm text-cyan-100">
                Feature this video (appears in highlighted sections)
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{editingVideo ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <span>{editingVideo ? 'Update Video' : 'Add Video'}</span>
                )}
              </button>
              {editingVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setUrl('');
                    setCategory(availableCategories[0]);
                    setFeatured(false);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-cyan-100">Existing Videos ({videos.length})</h3>
          <div className="text-sm text-gray-400">
            Sorted by publish date (newest first)
          </div>
        </div>

        {videos.length === 0 ? (
          <p className="text-gray-400">No videos found. Add your first video above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...videos]
              .sort((a, b) => {
                if (a.publishedAt && b.publishedAt) {
                  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                }
                if (a.publishedAt) return -1;
                if (b.publishedAt) return 1;
                return 0;
              })
              .map((video, index) => (
              <div key={video.id || index} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-white line-clamp-1">
                    {video.title.includes('[Pending') ? (
                      <span className="text-amber-400">{video.title}</span>
                    ) : (
                      video.title
                    )}
                  </h4>

                  {video.title.includes('[Pending') ? (
                    <span className="bg-amber-900/30 text-amber-300 text-xs px-2 py-1 rounded flex-shrink-0 ml-2">
                      Pending
                    </span>
                  ) : video.featured ? (
                    <span className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 rounded flex-shrink-0 ml-2">
                      Featured
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-gray-400 mb-2">Category: {video.category}</p>
                {video.channelName && (
                  <p className="text-sm text-gray-400 mb-1">Channel: {video.channelName}</p>
                )}
                {video.publishedAt && (
                  <p className="text-sm text-gray-400 mb-1">
                    Published: {new Date(video.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                  </p>
                )}
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{video.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {!video.title.includes('[Pending') && video.url ? (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        View on YouTube ↗
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">URL pending</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(video)}
                      className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
                          handleDelete(video.id || `video-${index}`);
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
