/**
 * Admin API endpoint to migrate videos from markdown files to database
 * POST /api/admin/migrate-videos
 */

import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { YouTubeModel } from '@/lib/db/models';

interface VideoFrontmatter {
  url: string;
  title: string;
  description: string;
  publishedDate?: string;
  publishedAt?: string;
  category: string;
  featured: boolean;
}

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'devenspear';
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'FUTUREp@ss2025';

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Run migration
    const videosDir = path.join(process.cwd(), 'content/youtube/videos');
    const files = fs.readdirSync(videosDir).filter(file => file.endsWith('.md'));

    let successCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(videosDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        const frontmatter = data as VideoFrontmatter;

        // Extract video ID
        const videoId = extractVideoId(frontmatter.url);

        if (!videoId) {
          errors.push(`Could not extract video ID from ${file}: ${frontmatter.url}`);
          skippedCount++;
          continue;
        }

        // Check if video already exists
        const existing = await YouTubeModel.findByVideoId(videoId);

        if (existing) {
          // Update if it's archived or has placeholder data
          if (existing.status === 'archived' || existing.title === '[Pending YouTube API]') {
            const dateString = frontmatter.publishedAt || frontmatter.publishedDate;
            const publishedDate = dateString ? new Date(dateString) : new Date();

            await YouTubeModel.update(existing.id, {
              title: frontmatter.title,
              description: frontmatter.description || '',
              category: frontmatter.category || 'Interview',
              featured: frontmatter.featured || false,
              status: 'published',
              published_date: publishedDate.toISOString(),
              thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            });

            updatedCount++;
            console.log(`Updated: ${frontmatter.title} (${videoId})`);
          } else {
            skippedCount++;
          }
          continue;
        }

        // Parse published date
        const dateString = frontmatter.publishedAt || frontmatter.publishedDate;
        const publishedDate = dateString ? new Date(dateString) : new Date();

        // Create video record
        // Use i.ytimg.com domain with hqdefault for better compatibility
        const videoData = {
          video_id: videoId,
          title: frontmatter.title,
          description: frontmatter.description || '',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          channel: 'YouTube',
          published_date: publishedDate,
          category: frontmatter.category || 'Interview',
          featured: frontmatter.featured || false,
          status: 'published' as const,
          duration: 0,
          tags: null,
        };

        await YouTubeModel.create(videoData);
        successCount++;
        console.log(`Created: ${frontmatter.title} (${videoId})`);

      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        errors.push(`Error processing ${file}: ${error}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        successCount,
        updatedCount,
        skippedCount,
        errorCount,
        totalFiles: files.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: String(error) },
      { status: 500 }
    );
  }
}
