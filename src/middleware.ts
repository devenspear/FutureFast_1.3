import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from './lib/auth';

const PUBLIC_PATHS = ['/admin/login', '/admin/news-submit']; // Temporarily added /admin/news-submit for testing

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

    try {
      // Verify the token
      console.log('[Middleware] Verifying token...');
      const { isValid } = await verifyAuthToken(token);
      
      if (!isValid) {
        console.log('[Middleware] Invalid token, redirecting to login');
        // Clear invalid token and redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }
      
      console.log('[Middleware] Token valid, allowing access');
    } catch (error) {
      console.error('[Middleware] Error verifying token:', error);
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
