import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { YouTubeModel } from '@/lib/db/models';

function extractVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract video ID from slug (format: video-{videoId})
function extractVideoIdFromSlug(slug: string): string | null {
  if (slug.startsWith('video-')) {
    return slug.substring(6);
  }
  return slug;
}

async function getVideoBySlug(slug: string) {
  const videoId = extractVideoIdFromSlug(slug);
  if (!videoId) return null;

  const video = await YouTubeModel.findByVideoId(videoId);
  if (!video || video.status === 'archived') return null;

  return video;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    return {
      title: 'Video Not Found | FutureFast',
    };
  }

  const videoId = video.video_id;

  return {
    title: `${video.title} | Video | FutureFast`,
    description: video.description || `Watch: ${video.title}`,
    openGraph: {
      title: video.title,
      description: video.description || '',
      url: `https://futurefast.ai/videos/${slug}`,
      type: 'video.other',
      siteName: 'FutureFast',
      videos: [
        {
          url: video.url,
          width: 1280,
          height: 720,
        },
      ],
      images: [
        {
          url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: 'player',
      title: video.title,
      description: video.description || '',
      images: [`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`],
    },
  };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const videoId = video.video_id;

  // Increment view count (fire and forget)
  YouTubeModel.incrementViewCount(video.id).catch(() => {});

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <article className="max-w-2xl mx-auto bg-gray-900/80 rounded-xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold font-orbitron mb-2">{video.title}</h1>
        <div className="flex items-center text-sm text-gray-400 mb-4 gap-4">
          <span>{video.channel || 'YouTube'}</span>
          {video.published_date && (
            <>
              <span>•</span>
              <span>
                {new Date(video.published_date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
              </span>
            </>
          )}
          {video.category && (
            <>
              <span>•</span>
              <span className="text-cyan-400">{video.category}</span>
            </>
          )}
        </div>
        {video.description && (
          <p className="text-lg text-gray-200 mb-6 whitespace-pre-line line-clamp-6">
            {video.description}
          </p>
        )}
        {videoId && (
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-80 rounded-lg border border-gray-700 shadow-lg"
            />
          </div>
        )}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
        >
          Watch on YouTube ↗
        </a>
      </article>
      {/* VideoObject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: video.title,
            description: video.description || '',
            uploadDate: video.published_date?.toISOString(),
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            url: video.url,
            publisher: {
              '@type': 'Organization',
              name: video.channel || 'YouTube',
            },
          }),
        }}
      />
    </main>
  );
}
