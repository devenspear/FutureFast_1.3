import { Metadata } from 'next';
import YouTubeSubmitForm from '../../../components/admin/YouTubeSubmitForm';
import { loadYouTubeVideos } from '../../../../lib/content-loader';

export const metadata: Metadata = {
  title: 'Manage YouTube Videos | FutureFast Admin',
  description: 'Add and manage YouTube video interviews for the FutureFast website',
};

export default async function AdminYouTubePage() {
  // Get existing YouTube videos to extract categories
  const videos = await loadYouTubeVideos();
  
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
              <h3 className="text-lg font-medium text-cyan-100 mb-2">What Happens Next</h3>
              <p>
                After adding a video, the system will:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Add the video to the content/youtube/videos.md file</li>
                <li>Fetch metadata from the YouTube API (title, description, etc.)</li>
                <li>Update the website to display the new video</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-cyan-100 mb-2">Command Line Alternative</h3>
              <p>
                You can also add videos using the command line script:
              </p>
              <div className="bg-gray-800 p-3 rounded font-mono text-sm mt-2">
                <code>node scripts/add-youtube-video.js &lt;youtube-url&gt; [category] [featured]</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
