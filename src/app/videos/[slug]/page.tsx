import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface VideoFrontmatter {
  url: string;
  title: string;
  description: string;
  category?: string;
  featured?: boolean;
  publishedAt?: string;
  channelTitle?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await getVideoBySlug(slug);
  return {
    title: `${frontmatter.title} | Video | FutureFast` || 'Video Interview',
    description: frontmatter.description || `Watch: ${frontmatter.title}`,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description || '',
      url: `https://futurefast.ai/videos/${slug}`,
      type: 'video.other',
      siteName: 'FutureFast',
      videos: [
        {
          url: frontmatter.url,
          width: 1280,
          height: 720,
        },
      ],
      images: [
        {
          url: `https://i.ytimg.com/vi/${extractVideoId(frontmatter.url)}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'player',
      title: frontmatter.title,
      description: frontmatter.description || '',
      images: [`https://i.ytimg.com/vi/${extractVideoId(frontmatter.url)}/maxresdefault.jpg`],
    },
  };
}

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

async function getVideoBySlug(slug: string) {
  const videosDir = path.join(process.cwd(), 'content/youtube/videos');
  const filePath = path.join(videosDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { frontmatter: data as VideoFrontmatter, content };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { frontmatter } = await getVideoBySlug(slug);
  const videoId = extractVideoId(frontmatter.url);
  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <article className="max-w-2xl mx-auto bg-gray-900/80 rounded-xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold font-orbitron mb-2">{frontmatter.title}</h1>
        <div className="flex items-center text-sm text-gray-400 mb-4 gap-4">
          <span>{frontmatter.channelTitle || 'YouTube'}</span>
          {frontmatter.publishedAt && <><span>•</span><span>{new Date(frontmatter.publishedAt).toLocaleDateString()}</span></>}
        </div>
        {frontmatter.description && <p className="text-lg text-gray-200 mb-6">{frontmatter.description}</p>}
        {videoId && (
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={frontmatter.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-80 rounded-lg border border-gray-700 shadow-lg"
            />
          </div>
        )}
        <a href={frontmatter.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors">Watch on YouTube ↗</a>
      </article>
      {/* VideoObject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: frontmatter.title,
            description: frontmatter.description || '',
            uploadDate: frontmatter.publishedAt,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            url: frontmatter.url,
            publisher: {
              '@type': 'Organization',
              name: frontmatter.channelTitle || 'YouTube',
            },
          }),
        }}
      />
    </main>
  );
} 