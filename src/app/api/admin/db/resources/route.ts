/**
 * Admin API - Resources CRUD
 * POST   /api/admin/db/resources - Create new resource
 * GET    /api/admin/db/resources - List resources with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';
import { ResourceModel } from '@/lib/db/models';

/**
 * GET - List all resources with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined;
    const category = searchParams.get('category') || undefined;
    const file_type = searchParams.get('file_type') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || undefined;

    // Fetch resources
    const resources = await ResourceModel.findAll({
      status,
      featured,
      category,
      file_type,
      limit,
      offset,
      search,
    });

    // Get total count
    const total = await ResourceModel.count({ status, featured, category, file_type });

    return NextResponse.json({
      success: true,
      data: resources,
      total,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new resource
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { isValid } = await verifyAuthToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      file_url,
      file_type,
      file_size,
      thumbnail_url,
      cover_image_url,
      category,
      tags,
      author,
      source,
      published_date,
      featured = false,
      status = 'published',
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Check if file URL already exists (if provided)
    if (file_url) {
      const existing = await ResourceModel.findByFileUrl(file_url);
      if (existing) {
        return NextResponse.json(
          { error: 'This file URL has already been added. Please check existing resources.' },
          { status: 409 }
        );
      }
    }

    console.log(`📚 Creating resource: ${title}`);

    // Create resource in database
    const resource = await ResourceModel.create({
      title,
      description,
      file_url,
      file_type,
      file_size,
      thumbnail_url,
      cover_image_url,
      category,
      tags,
      author,
      source,
      published_date,
      featured,
      status,
      created_by: 'admin',
    });

    console.log(`✅ Resource created: ${resource.id}`);

    return NextResponse.json({
      success: true,
      message: 'Resource created successfully!',
      data: resource,
    });

  } catch (error: any) {
    console.error('Error creating resource:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to create resource';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
