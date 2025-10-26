/**
 * Database Admin Dashboard
 * New mobile-optimized admin interface using Postgres database
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NewsManagement from '@/components/admin/db/NewsManagement';
import YouTubeManagement from '@/components/admin/db/YouTubeManagement';

export default function DatabaseAdminPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'youtube'>('news');
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                FutureFast.ai Admin
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                Content Management System
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors touch-manipulation"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation - Mobile-optimized */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-shrink-0 px-6 py-3 md:py-2 rounded-lg text-base md:text-sm font-medium transition-colors touch-manipulation ${
                activeTab === 'news'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📰 News
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex-shrink-0 px-6 py-3 md:py-2 rounded-lg text-base md:text-sm font-medium transition-colors touch-manipulation ${
                activeTab === 'youtube'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎥 Videos
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'news' && <NewsManagement />}
        {activeTab === 'youtube' && <YouTubeManagement />}
      </main>

      {/* Footer - Hidden on mobile */}
      <footer className="hidden md:block bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400 text-sm">
            FutureFast.ai Database Admin • Powered by Vercel Postgres
          </p>
        </div>
      </footer>

      {/* Mobile-specific CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
