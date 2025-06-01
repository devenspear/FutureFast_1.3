import { Metadata } from 'next';
import { loadYouTubeVideos, loadNewsItems, loadCatalogItems } from '../../../lib/content-loader';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | FutureFast',
  description: 'Manage content for the FutureFast website',
};

export default async function AdminPage() {
  // Load all content data
  const videos = await loadYouTubeVideos();
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
      <h1 className="text-3xl font-bold text-white mb-2">FutureFast Admin Dashboard</h1>
      <p className="font-sans text-lg md:text-xl text-cyan-100 mb-8">
        Manage all website content in one place
      </p>
      
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
