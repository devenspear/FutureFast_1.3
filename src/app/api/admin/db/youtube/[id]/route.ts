/**
 * Admin API - Single YouTube Video Operations
 * GET    /api/admin/db/youtube/[id] - Get single video
 * PATCH  /api/admin/db/youtube/[id] - Update video
 * DELETE /api/admin/db/youtube/[id] - Delete video
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { YouTubeModel } from '@/lib/db/models';

/**
 * Verify authentication middleware
 */
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return { isValid: false, error: 'Authentication required', status: 401 };
  }

  const { isValid } = await verifyAuthToken(token);
  if (!isValid) {
    return { isValid: false, error: 'Invalid or expired token', status: 401 };
  }

  return { isValid: true };
}

/**
 * GET - Fetch single YouTube video by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const video = await YouTubeModel.findById(params.id);

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video,
    });

  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update YouTube video
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    // Validate video exists
    const existing = await YouTubeModel.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Update video
    const updated = await YouTubeModel.update(params.id, body);

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      data: updated,
    });

  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete (archive) YouTube video
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Check if video exists
    const existing = await YouTubeModel.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Soft delete (archive)
    const success = await YouTubeModel.delete(params.id);

    if (!success) {
      throw new Error('Delete operation failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Video archived successfully',
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
