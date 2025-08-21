import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this is an admin route (UI or API)
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminAPI = pathname.startsWith('/api/admin/');
  
  if (isAdminRoute || isAdminAPI) {
    console.log('Middleware triggered for:', pathname);
    
    // Check for auth cookie first (set when user logs in via Basic Auth)
    const authCookie = request.cookies.get('admin-auth');
    const authHeader = request.headers.get('authorization');
    
    let isAuthenticated = false;
    
    // Check Basic Auth header first (primary authentication)
    if (authHeader && isValidAuthHeader(authHeader)) {
      console.log('Basic Auth authentication found for:', pathname);
      isAuthenticated = true;
      
      // Set cookie for subsequent API calls from the browser
      const response = NextResponse.next();
      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: false, // Allow JavaScript to read it
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
        maxAge: 60 * 60 * 24, // 24 hours
      });
      
      if (isAdminAPI) {
        response.headers.set('x-authenticated', 'true');
      }
      
      return response;
    }
    // Check cookie-based auth (for API calls from authenticated browser sessions)
    else if (authCookie?.value === 'authenticated') {
      console.log('Cookie-based authentication found for:', pathname);
      isAuthenticated = true;
    }
    
    if (!isAuthenticated) {
      console.log('Authentication failed for:', pathname);
      
      // For API routes, return JSON error
      if (isAdminAPI) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { 
            status: 401,
            headers: {
              'WWW-Authenticate': 'Basic realm="FutureFast Admin API"',
            }
          }
        );
      }
      
      // For UI routes, return HTML with auth prompt
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="FutureFast Admin"',
        },
      });
    }
    
    console.log('Authentication successful for:', pathname);
    
    // For authenticated API requests, pass the auth status to the route
    if (isAdminAPI) {
      const response = NextResponse.next();
      response.headers.set('x-authenticated', 'true');
      return response;
    }
  }
  
  return NextResponse.next();
}

// Configure which paths should be protected by this middleware
export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};

// Validate the authorization header
function isValidAuthHeader(authHeader: string): boolean {
  if (!authHeader.startsWith('Basic ')) {
    return false;
  }
  
  // Get the credentials part (after 'Basic ')
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  
  // Split into username and password
  const [username, password] = credentials.split(':');
  
  // Check against environment variables or hardcoded values (for demo purposes only)
  // In production, use environment variables
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'futurefast2025';
  
  console.log('Checking credentials:', { 
    providedUsername: username,
    expectedUsername: expectedUsername,
    isPasswordCorrect: password === expectedPassword
  });
  
  return username === expectedUsername && password === expectedPassword;
}
