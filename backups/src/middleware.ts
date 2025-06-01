import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const PUBLIC_PATHS = ['/admin/login', '/api/admin/auth/login', '/api/admin/auth/status'];

// Token validation function (in production, this would verify JWT or other token format)
function isValidToken(token: string): boolean {
  // In production, this would validate the token structure, expiration, and signature
  // For now, we're just checking that a token exists and has sufficient length
  return Boolean(token) && token.length >= 32;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Request: ${request.method} ${pathname}`);

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    console.log('[Middleware] Allowing access to public path:', pathname);
    return NextResponse.next();
  }

  // Check for admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    console.log('[Middleware] Admin route access - Token present:', !!token);

    if (!token) {
      // Redirect to login if no token
      console.log('[Middleware] No token found, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate the token
    if (isValidToken(token)) {
      console.log('[Middleware] Token valid, allowing access');
      return NextResponse.next();
    } else {
      console.log('[Middleware] Invalid token, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
