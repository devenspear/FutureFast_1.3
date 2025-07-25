import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Metadata } from 'next';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  featured?: boolean;
}

export const metadata: Metadata = {
  title: 'Blog | FutureFast',
  description: 'Thought leadership and insights on the future of technology, AI, and innovation.',
  openGraph: {
    title: 'Blog | FutureFast',
    description: 'Thought leadership and insights on the future of technology, AI, and innovation.',
    url: 'https://futurefast.ai/blog',
    type: 'website',
    siteName: 'FutureFast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | FutureFast',
    description: 'Thought leadership and insights on the future of technology, AI, and innovation.',
  },
};

function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const filePath = path.join(blogDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const slug = file.replace(/\.md$/, '');
    
    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'FutureFast Team',
      tags: data.tags || [],
      featured: data.featured || false,
    } as BlogPost;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            FutureFast Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thought leadership and insights on the future of technology, AI, and innovation.
          </p>
        </div>

        {/* Featured Posts */}
        {posts.filter(post => post.featured).length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-cyan-400">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.filter(post => post.featured).map(post => (
                <article key={post.slug} className="bg-gray-900/80 rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="mb-4">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white hover:text-cyan-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">All Posts</h2>
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post.slug} className="bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                <h3 className="text-xl font-bold mb-3 text-white hover:text-cyan-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Blog Posts Yet</h3>
            <p className="text-gray-400">Check back soon for thought leadership content and insights.</p>
          </div>
        )}
      </div>
    </main>
  );
} 