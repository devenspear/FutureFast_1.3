/**
 * Admin API - Single Resource Operations
 * GET    /api/admin/db/resources/[id] - Get single resource
 * PATCH  /api/admin/db/resources/[id] - Update resource
 * DELETE /api/admin/db/resources/[id] - Delete resource
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { ResourceModel } from '@/lib/db/models';

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
 * GET - Fetch single resource by ID
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

    const resource = await ResourceModel.findById(params.id);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });

  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update resource
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

    // Validate resource exists
    const existing = await ResourceModel.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Update resource
    const updated = await ResourceModel.update(params.id, body);

    return NextResponse.json({
      success: true,
      message: 'Resource updated successfully',
      data: updated,
    });

  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete (archive) resource
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

    // Check if resource exists
    const existing = await ResourceModel.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Soft delete (archive)
    const success = await ResourceModel.delete(params.id);

    if (!success) {
      throw new Error('Delete operation failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Resource archived successfully',
    });

  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
