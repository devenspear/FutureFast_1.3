'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { CatalogItem } from '../../../../lib/content-loader';

// Form data structure including optional thumbnail file
interface AddResourceFormData {
  url: string;
  type: string;
  publishDate: string;
  thumbnailFile?: File | null;
}

interface ResourceSectionProps {
  resources: CatalogItem[];
  types: string[];
}

export default function ResourceSection({ resources, types }: ResourceSectionProps) {
  const [url, setUrl] = useState('');
  const [type, setType] = useState(types[0] || 'Report');
  const [publishDate, setPublishDate] = useState(() => {
    // Default to current date in YYYY-MM format
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showForm, setShowForm] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Default types if none provided
  const availableTypes = types.length > 0 ? types : [
    'Report',
    'Whitepaper',
    'Research',
    'Analysis',
    'Guide',
    'Case Study'
  ];
  
  const { handleSubmit, isSubmitting, error, successMessage } = useFormSubmit<AddResourceFormData>(
    async (formData: AddResourceFormData) => {
      // 1. Upload thumbnail (if provided)
      let imageUrl = '';
      if (formData.thumbnailFile) {
        const uploadData = new FormData();
        uploadData.append('file', formData.thumbnailFile);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData,
          credentials: 'include',
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Thumbnail upload failed');
        }
        const uploadJson = await uploadRes.json();
        imageUrl = uploadJson.imageUrl;
      }

      // 2. Add resource with image URL (if any)
      const bodyToSend = {
        url: formData.url,
        type: formData.type,
        publishDate: formData.publishDate,
        image: imageUrl,
      };
      const response = await fetch('/api/admin/resources/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add resource');
      }
      
      return response.json();
    },
    () => {
      // Reset form on success
      setUrl('');
      setType(availableTypes[0]);
      const now = new Date();
      setPublishDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
      setThumbnailFile(null);
      setThumbnailPreview(null);
    },
    (error) => {
      console.error('Error adding resource:', error);
    },
    'Resource added successfully! Metadata has been generated using AI.'
  );
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({ url, type, publishDate, thumbnailFile });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Resource Library Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
        >
          {showForm ? 'Hide Form' : 'Add Resource'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium text-cyan-100 mb-4">Add Resource</h3>
          
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
              <label htmlFor="resource-url" className="block text-sm font-medium text-cyan-100 mb-1">
                PDF Resource URL
              </label>
              <input
                type="url"
                id="resource-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/resource.pdf"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="mt-1 text-sm font-sans text-gray-400">
                Paste the full URL to the PDF resource. AI will generate a title and description.
              </p>
            </div>
            
            <div>
              <label htmlFor="resource-type" className="block text-sm font-medium text-cyan-100 mb-1">
                Resource Type
              </label>
              <select
                id="resource-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="publish-date" className="block text-sm font-medium text-cyan-100 mb-1">
                Publication Date
              </label>
              <input
                type="month"
                id="publish-date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="mt-1 text-sm font-sans text-gray-400">
                When was this resource actually published? Defaults to current month. This controls where it appears in the library.
              </p>
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-cyan-100 mb-1">
                Thumbnail Image (optional)
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setThumbnailFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setThumbnailPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setThumbnailPreview(null);
                  }
                }}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {thumbnailPreview && (
                <Image src={thumbnailPreview} alt="Thumbnail preview" width={200} height={200} className="mt-2 h-24 object-cover rounded" />
              )}
              <p className="mt-1 text-sm font-sans text-gray-400">
                Upload a cover image (600×400 recommended). If omitted, a placeholder will be generated.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-sans px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Adding...' : 'Add Resource'}
              </button>
            </div>
            
            <div className="mt-4 text-sm font-sans text-gray-400">
              <p>When you add a resource:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
                <li>AI will analyze the PDF and extract key information</li>
                <li>The system will generate a title, description, and appropriate tags</li>
                <li>The resource will be added to the resource library section</li>
              </ul>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-cyan-100 mb-4">Existing Resources ({resources.length})</h3>
        
        {resources.length === 0 ? (
          <p className="text-gray-400">No resources found. Add your first resource above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort resources by publication date (newest first) */}
            {[...resources]
              .sort((a, b) => {
                // First compare years (descending)
                const yearA = typeof a.year === 'string' ? parseInt(a.year, 10) : a.year;
                const yearB = typeof b.year === 'string' ? parseInt(b.year, 10) : b.year;
                const yearDiff = yearB - yearA;
                if (yearDiff !== 0) return yearDiff;
                
                // If years are the same, compare months
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return months.indexOf(b.month) - months.indexOf(a.month);
              })
              .map((resource, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-1 line-clamp-2">{resource.title}</h4>
                <p className="text-sm text-gray-400 mb-1">Type: {resource.type}</p>
                <p className="text-sm text-gray-400 mb-1">
                  Published: {resource.month} {resource.year}
                </p>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    View Resource
                  </a>
                  {resource.tag && (
                    <span className="bg-cyan-900/30 text-cyan-300 text-xs px-2 py-1 rounded">
                      {resource.tag}
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
