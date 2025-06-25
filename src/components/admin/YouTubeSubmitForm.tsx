'use client';

import { useState } from 'react';
import { useFormSubmit } from '../../hooks/useFormSubmit';

interface YouTubeSubmitFormProps {
  categories?: string[];
}

export default function YouTubeSubmitForm({ categories = [] }: YouTubeSubmitFormProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Interview');
  const [featured, setFeatured] = useState(false);
  
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
    () => {
      // Reset form on success
      setUrl('');
      setCategory('Interview');
      setFeatured(false);
    },
    (error) => {
      console.error('Error adding YouTube video:', error);
    },
    'YouTube video added successfully! Metadata will be fetched automatically.'
  );
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ url, category, featured });
  };
  
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-6">Add YouTube Video</h2>
      
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
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-700 rounded bg-gray-800"
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
        
        <div className="mt-4 text-sm font-sans text-gray-400">
          <p>After adding, the YouTube API will automatically fetch the video metadata (title, description, etc.)</p>
        </div>
      </form>
    </div>
  );
}
