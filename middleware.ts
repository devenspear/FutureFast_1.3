import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    console.log('Middleware triggered for admin route');
    
    // Check if the user is authenticated
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !isValidAuthHeader(authHeader)) {
      console.log('Authentication failed or not provided');
      
      // Return a response that will trigger the browser to show a login prompt
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="FutureFast Admin"',
        },
      });
    }
    
    console.log('Authentication successful');
  }
  
  return NextResponse.next();
}

// Configure which paths should be protected by this middleware
export const config = {
  matcher: ['/admin', '/admin/:path*'],
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
  
  console.log('Checking credentials against:', { expectedUsername });
  
  return username === expectedUsername && password === expectedPassword;
}
