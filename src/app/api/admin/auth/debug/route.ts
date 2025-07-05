import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('🔍 [Auth Debug API] Debug request received');
  
  try {
    // Get all headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 [Auth Debug API] All headers:', headers);
    
    // Get cookie header specifically
    const cookieHeader = request.headers.get('cookie');
    console.log('🍪 [Auth Debug API] Cookie header:', cookieHeader);
    
    // Parse cookies
    const cookies = cookieHeader ? 
      cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>) : {};
    
    console.log('🍪 [Auth Debug API] Parsed cookies:', Object.keys(cookies));
    
    // Check for auth token
    const authToken = cookies['auth-token'];
    console.log('🔑 [Auth Debug API] Auth token found:', !!authToken);
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasAuthToken: !!authToken,
      authTokenPreview: authToken ? authToken.substring(0, 50) + '...' : null,
      cookieCount: Object.keys(cookies).length,
      cookieNames: Object.keys(cookies),
      userAgent: headers['user-agent'] || 'Unknown',
      origin: headers['origin'] || 'Unknown',
      referer: headers['referer'] || 'Unknown',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasAdminUsername: !!process.env.ADMIN_USERNAME,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD,
        hasJWTSecret: !!process.env.JWT_SECRET,
      }
    };
    
    console.log('📊 [Auth Debug API] Debug info compiled:', debugInfo);
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('💥 [Auth Debug API] Error:', error);
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 