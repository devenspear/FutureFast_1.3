import { Metadata } from 'next';
import YouTubeSubmitForm from '../../../components/admin/YouTubeSubmitForm';
import { YouTubeModel } from '@/lib/db/models';

export const metadata: Metadata = {
  title: 'Manage YouTube Videos | FutureFast Admin',
  description: 'Add and manage YouTube video interviews for the FutureFast website',
};

export const dynamic = 'force-dynamic';

export default async function AdminYouTubePage() {
  // Get existing YouTube videos from database
  const dbVideos = await YouTubeModel.findAll({ status: 'published', limit: 1000 });

  // Transform to expected format
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

  // Extract unique categories from existing videos
  const categories = Array.from(
    new Set(videos.map(video => video.category).filter(Boolean))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">YouTube Video Management</h1>
      <p className="font-sans text-lg md:text-xl text-cyan-100 mb-8">
        Add new video interviews and manage existing content
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <YouTubeSubmitForm categories={categories} />
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-white mb-6">Instructions</h2>

          <div className="space-y-4 font-sans text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-cyan-100 mb-2">Adding a New Video</h3>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Paste the full YouTube URL in the form</li>
                <li>Select an appropriate category</li>
                <li>Check the &quot;Featured&quot; box if this is a highlight video</li>
                <li>Click &quot;Add YouTube Video&quot; to submit</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-100 mb-2">What Happens</h3>
              <p>
                After adding a video, the system will:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Fetch metadata from the YouTube API (title, description, etc.)</li>
                <li>Save directly to the database</li>
                <li>Video appears immediately on the website - no deployment required!</li>
              </ul>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-medium text-green-300 mb-2 flex items-center gap-2">
                <span>✓</span> Instant Updates
              </h3>
              <p className="text-green-200 text-sm">
                Videos are now saved directly to the database. Changes are instant - no more waiting for deployments!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
