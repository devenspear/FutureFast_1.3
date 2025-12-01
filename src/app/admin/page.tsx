import { Metadata } from 'next';
import { loadNewsItems, loadCatalogItems } from '../../../lib/content-loader';
import { YouTubeModel } from '@/lib/db/models';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | FutureFast',
  description: 'Manage content for the FutureFast website',
};

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  // Load videos from database
  const dbVideos = await YouTubeModel.findAll({ status: 'published', limit: 1000 });
  const videos = dbVideos.map((video) => ({
    id: video.video_id,
    videoId: video.video_id,
    title: video.title,
    description: video.description || '',
    url: video.url,
    thumbnail: video.thumbnail_url || `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`,
    thumbnailUrl: video.thumbnail_url || `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`,
    channelTitle: video.channel || 'YouTube',
    channelName: video.channel || 'YouTube',
    publishedAt: video.published_date?.toISOString() || video.created_at.toISOString(),
    category: video.category || 'Interview',
    featured: video.featured,
  }));

  // Load other content from markdown
  const newsItems = await loadNewsItems();
  const catalogItems = await loadCatalogItems();
  
  // Extract unique categories from existing videos
  const videoCategories = Array.from(
    new Set(videos.map(video => video.category).filter(Boolean))
  );
  
  // Extract unique types from catalog items
  const resourceTypes = Array.from(
    new Set(catalogItems.map(item => item.type).filter(Boolean))
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold admin-text-primary font-orbitron">
              Content Management
            </h1>
            <p className="font-sans text-lg admin-text-secondary mt-1">
              Manage all website content from this centralized dashboard
            </p>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="admin-card p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold admin-text-primary">{videos.length}</p>
              <p className="text-sm admin-text-muted">Videos</p>
            </div>
          </div>
          
          <div className="admin-card p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold admin-text-primary">{newsItems.length}</p>
              <p className="text-sm admin-text-muted">News Articles</p>
            </div>
          </div>
          
          <div className="admin-card p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold admin-text-primary">{catalogItems.length}</p>
              <p className="text-sm admin-text-muted">Resources</p>
            </div>
          </div>
        </div>
      </div>
      
      <AdminDashboard 
        videos={videos}
        newsItems={newsItems}
        catalogItems={catalogItems}
        videoCategories={videoCategories}
        resourceTypes={resourceTypes}
      />
    </div>
  );
}
