import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface BlogPostFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  featured?: boolean;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { frontmatter } = await getBlogPostBySlug(params.slug);
  return {
    title: `${frontmatter.title} | Blog | FutureFast`,
    description: frontmatter.excerpt || `Read: ${frontmatter.title}`,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt || '',
      url: `https://futurefast.ai/blog/${params.slug}`,
      type: 'article',
      siteName: 'FutureFast',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      images: [
        {
          url: 'https://futurefast.ai/social-share.png',
          width: 1200,
          height: 630,
          alt: 'FutureFast Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt || '',
      images: ['https://futurefast.ai/social-share.png'],
    },
  };
}

async function getBlogPostBySlug(slug: string) {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const filePath = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  return { frontmatter: data as BlogPostFrontmatter, content };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { frontmatter, content } = await getBlogPostBySlug(params.slug);
  
  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <article className="max-w-3xl mx-auto">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-white">
            {frontmatter.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <span>By {frontmatter.author}</span>
            <span>•</span>
            <span>{new Date(frontmatter.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            {frontmatter.featured && (
              <>
                <span>•</span>
                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs">
                  Featured
                </span>
              </>
            )}
          </div>

          {frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {frontmatter.tags.map(tag => (
                <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {frontmatter.excerpt && (
            <p className="text-lg text-gray-300 italic border-l-4 border-cyan-500 pl-4">
              {frontmatter.excerpt}
            </p>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Written by {frontmatter.author}
            </div>
            <Link 
              href="/blog"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All Posts →
            </Link>
          </div>
        </footer>
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
            author: {
              '@type': 'Person',
              name: frontmatter.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'FutureFast',
              url: 'https://futurefast.ai',
            },
            url: `https://futurefast.ai/blog/${params.slug}`,
            mainEntityOfPage: `https://futurefast.ai/blog/${params.slug}`,
            description: frontmatter.excerpt || '',
            image: 'https://futurefast.ai/social-share.png',
            keywords: frontmatter.tags.join(', '),
          }),
        }}
      />
    </main>
  );
} 