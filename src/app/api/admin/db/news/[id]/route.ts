/**
 * Admin API - Single News Article Operations
 * GET    /api/admin/db/news/[id] - Get single article
 * PATCH  /api/admin/db/news/[id] - Update article
 * DELETE /api/admin/db/news/[id] - Delete article
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { NewsModel } from '@/lib/db/models';

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
 * GET - Fetch single news article by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const article = await NewsModel.findById(id);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update news article
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate article exists
    const existing = await NewsModel.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Update article
    const updated = await NewsModel.update(id, body);

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      data: updated,
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete (archive) news article
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth.isValid) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    // Check if article exists
    const existing = await NewsModel.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Soft delete (archive)
    const success = await NewsModel.delete(id);

    if (!success) {
      throw new Error('Delete operation failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Article archived successfully',
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
