'use client';

import { useState } from 'react';
import { useFormSubmit } from '../../hooks/useFormSubmit';

interface YouTubeSubmitFormProps {
  categories?: string[];
}

interface SubmitResponse {
  success: boolean;
  message: string;
  videoId?: string;
  slug?: string;
  commitSha?: string;
  note?: string;
}

export default function YouTubeSubmitForm({ categories = [] }: YouTubeSubmitFormProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Interview');
  const [featured, setFeatured] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);

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

  const { handleSubmit, isSubmitting, error, successMessage, data } = useFormSubmit<
    { url: string; category: string; featured: boolean },
    SubmitResponse
  >(
    async (formData: { url: string; category: string; featured: boolean }) => {
      const response = await fetch('/api/admin/youtube/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // This is needed to send the auth cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add YouTube video');
      }

      return response.json();
    },
    (result) => {
      // Reset form on success
      setUrl('');
      setCategory('Interview');
      setFeatured(false);
      setSubmitResponse(result);
    },
    (error) => {
      console.error('Error adding YouTube video:', error);
      setSubmitResponse(null);
    }
  );
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ url, category, featured });
  };
  
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Add YouTube Video</h2>
        {isSubmitting && (
          <div className="flex items-center space-x-2 text-cyan-400 text-sm">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-sans">Processing...</span>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-red-900/20 border-l-4 border-red-500 text-red-100 px-4 py-3 rounded-r animate-pulse">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold font-sans">Error</p>
                <p className="text-sm font-sans">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Success Display with Details */}
        {submitResponse && submitResponse.success && (
          <div className="bg-green-900/20 border-l-4 border-green-500 text-green-100 px-4 py-4 rounded-r animate-slide-in">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-bold font-sans text-lg">Video Added Successfully!</p>
                <p className="text-sm font-sans mt-1">{submitResponse.message}</p>

                {submitResponse.commitSha && (
                  <div className="mt-3 space-y-2 text-sm font-mono bg-gray-800/50 p-3 rounded">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Video ID:</span>
                      <span className="text-cyan-300">{submitResponse.videoId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Commit SHA:</span>
                      <span className="text-cyan-300 truncate ml-2">{submitResponse.commitSha?.substring(0, 7)}</span>
                    </div>
                  </div>
                )}

                {submitResponse.note && (
                  <div className="mt-3 bg-blue-900/20 border border-blue-500/30 rounded p-3">
                    <p className="text-sm font-sans text-blue-200">
                      <span className="font-bold">📝 Note:</span> {submitResponse.note}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center space-x-2 text-xs text-green-300">
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-sans">Deployment in progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-cyan-100 mb-2">
            YouTube URL <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <p className="mt-2 text-xs font-sans text-gray-400 flex items-center">
            <svg className="h-3.5 w-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Supports youtube.com and youtu.be formats
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-cyan-100 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={isSubmitting}
              className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700 mt-0.5 disabled:opacity-50"
            />
            <div className="ml-3">
              <label htmlFor="featured" className="block text-sm font-medium font-sans text-cyan-100 cursor-pointer">
                Feature this video
              </label>
              <p className="text-xs font-sans text-gray-400 mt-1">
                Featured videos appear in highlighted sections and get priority placement
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-sans px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Committing to GitHub...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add YouTube Video
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 bg-gray-800/30 border border-gray-700/50 rounded-md p-3">
          <p className="text-xs font-sans text-gray-400 flex items-start">
            <svg className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Videos are committed to GitHub and deployed automatically. YouTube metadata (title, description, thumbnail) will be fetched when the deployment completes.
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
