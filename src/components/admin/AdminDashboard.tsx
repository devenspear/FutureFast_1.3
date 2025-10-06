'use client';

import { useState } from 'react';
import YouTubeSubmitForm from './YouTubeSubmitForm';
import NewsSection from './sections/NewsSection';
import ResourceSection from './sections/ResourceSection';
import AlertNotificationCenter from './AlertNotificationCenter';
import { YouTubeVideoItem } from '../../types/youtube';
import { NewsItem, CatalogItem } from '../../../lib/content-loader';

interface AdminDashboardProps {
  videos: YouTubeVideoItem[];
  newsItems: NewsItem[];
  catalogItems: CatalogItem[];
  videoCategories: string[];
  resourceTypes: string[];
}

export default function AdminDashboard({
  videos,
  newsItems,
  catalogItems,
  videoCategories,
  resourceTypes
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  
  const sections = [
    { id: 'overview', name: 'Overview' },
    { id: 'alerts', name: 'Alerts & Monitoring' },
    { id: 'youtube', name: 'YouTube Videos' },
    { id: 'news', name: 'News Articles' },
    { id: 'resources', name: 'Resource Library' },
  ];
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Section Navigation */}
      <div className="bg-gray-800 p-4 sticky top-0 z-10">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-md font-sans text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Dashboard Overview */}
      {activeSection === 'overview' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-cyan-100 mb-2">YouTube Videos</h3>
              <p className="text-4xl font-bold text-white">{videos.length}</p>
              <p className="text-gray-400 mt-2">Total videos</p>
              <button
                onClick={() => setActiveSection('youtube')}
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
              >
                Manage Videos
              </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-cyan-100 mb-2">News Articles</h3>
              <p className="text-4xl font-bold text-white">{newsItems.length}</p>
              <p className="text-gray-400 mt-2">Total articles</p>
              <button
                onClick={() => setActiveSection('news')}
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
              >
                Manage News
              </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-cyan-100 mb-2">Resource Library</h3>
              <p className="text-4xl font-bold text-white">{catalogItems.length}</p>
              <p className="text-gray-400 mt-2">Total resources</p>
              <button
                onClick={() => setActiveSection('resources')}
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
              >
                Manage Resources
              </button>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-cyan-100 mb-4">System Status</h3>
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Workflow Processing</p>
                  <p className="text-lg font-semibold text-white mt-1">Monitor system health and alerts</p>
                </div>
                <button
                  onClick={() => setActiveSection('alerts')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-sm transition-colors"
                >
                  View Alert Center
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-cyan-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveSection('youtube')}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors text-left"
              >
                <span className="block font-medium">Add YouTube Video</span>
                <span className="text-gray-400 text-xs">Add a new interview or feature video</span>
              </button>
              
              <button
                onClick={() => setActiveSection('news')}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors text-left"
              >
                <span className="block font-medium">Add News Article</span>
                <span className="text-gray-400 text-xs">Add a new news article or press mention</span>
              </button>
              
              <button
                onClick={() => setActiveSection('resources')}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors text-left"
              >
                <span className="block font-medium">Add Resource</span>
                <span className="text-gray-400 text-xs">Add a new PDF resource to the library</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alert Notification Center */}
      {activeSection === 'alerts' && (
        <div className="p-6">
          <AlertNotificationCenter />
        </div>
      )}
      
      {/* YouTube Videos Section */}
      {activeSection === 'youtube' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">YouTube Video Management</h2>
          <p className="font-sans text-lg text-cyan-100 mb-8">
            Add new video interviews and manage existing content
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <YouTubeSubmitForm categories={videoCategories} />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Existing Videos ({videos.length})</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {videos.slice(0, 10).map((video) => (
                  <div key={video.id} className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-1">{video.title}</h4>
                    <p className="text-xs text-gray-400">Category: {video.category}</p>
                    {video.featured && (
                      <span className="inline-block mt-2 px-2 py-1 bg-cyan-600 text-white text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {videos.length > 10 && (
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Showing 10 of {videos.length} videos
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* News Articles Section */}
      {activeSection === 'news' && (
        <NewsSection 
          newsItems={newsItems} 
        />
      )}
      
      {/* Resource Library Section */}
      {activeSection === 'resources' && (
        <ResourceSection 
          resources={catalogItems}
          types={resourceTypes}
        />
      )}
    </div>
  );
}
