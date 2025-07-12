import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface NewsFrontmatter {
  title: string;
  url: string;
  source: string;
  date: string;
  featured?: boolean;
  icon?: string;
  summary?: string;
  tags?: string[];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { frontmatter } = await getNewsBySlug(params.slug);
  return {
    title: `${frontmatter.title} | News | FutureFast` || 'News Article',
    description: frontmatter.summary || `Read the latest news: ${frontmatter.title}`,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary || '',
      url: `https://futurefast.ai/news/${params.slug}`,
      type: 'article',
      siteName: 'FutureFast',
      images: [
        {
          url: 'https://futurefast.ai/social-share.png',
          width: 1200,
          height: 630,
          alt: 'FutureFast News',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.summary || '',
      images: ['https://futurefast.ai/social-share.png'],
    },
  };
}

async function getNewsBySlug(slug: string) {
  const newsDir = path.join(process.cwd(), 'content/news');
  const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'));
  let found = null;
  for (const file of files) {
    const filePath = path.join(newsDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    // Slug is filename without .md
    const fileSlug = file.replace(/\.md$/, '');
    if (fileSlug === slug) {
      found = { frontmatter: data as NewsFrontmatter, content };
      break;
    }
  }
  if (!found) notFound();
  return found;
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { frontmatter, content } = await getNewsBySlug(params.slug);
  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <article className="max-w-2xl mx-auto bg-gray-900/80 rounded-xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold font-orbitron mb-2">{frontmatter.title}</h1>
        <div className="flex items-center text-sm text-gray-400 mb-4 gap-4">
          <span>{frontmatter.source}</span>
          <span>•</span>
          <span>{new Date(frontmatter.date).toLocaleDateString()}</span>
        </div>
        {frontmatter.summary && <p className="text-lg text-gray-200 mb-6">{frontmatter.summary}</p>}
        <div className="prose prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: content }} />
        <a href={frontmatter.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors">Read Full Article ↗</a>
      </article>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: frontmatter.title,
            datePublished: frontmatter.date,
            author: { '@type': 'Organization', name: frontmatter.source },
            url: `https://futurefast.ai/news/${params.slug}`,
            mainEntityOfPage: `https://futurefast.ai/news/${params.slug}`,
            description: frontmatter.summary || '',
            image: 'https://futurefast.ai/social-share.png',
          }),
        }}
      />
    </main>
  );
} 