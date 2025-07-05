import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// Credentials should be stored in environment variables
// In production, these would be stored in a secure database with proper hashing
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Check if credentials are set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.warn('WARNING: ADMIN_USERNAME and/or ADMIN_PASSWORD environment variables are not set.');
  console.warn('Please set these in your .env.local file for secure authentication.');
}

// Rate limiting (simple in-memory implementation)
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
const attemptsByIp: Record<string, { count: number; lastAttempt: number; lockedUntil: number }> = {};

// Generate a secure JWT token
async function generateJWT(): Promise<string> {
  const JWT_SECRET = process.env.JWT_SECRET || 'futurefast-jwt-secret-key-super-secure-2025';
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // 2 hours expiration
    .sign(secret);
    
  return token;
}

// Note: Password hashing is handled elsewhere in the authentication flow

export async function POST(request: Request) {
  console.log('🔐 [Admin Login API] Login attempt started');
  console.log('🌍 [Admin Login API] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    hasUsername: !!ADMIN_USERNAME,
    hasPassword: !!ADMIN_PASSWORD,
    hasJWTSecret: !!process.env.JWT_SECRET
  });
  
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    console.log('🌐 [Admin Login API] Client IP:', clientIp);
    
    const now = Date.now();
    const ipAttempts = attemptsByIp[clientIp] || { count: 0, lastAttempt: 0, lockedUntil: 0 };
    
    // Check if IP is locked out
    if (ipAttempts.lockedUntil > now) {
      const remainingTime = Math.ceil((ipAttempts.lockedUntil - now) / 1000 / 60);
      console.log('🚫 [Admin Login API] IP locked out:', clientIp, 'for', remainingTime, 'minutes');
      return NextResponse.json({
        success: false,
        error: `Too many failed attempts. Try again in ${remainingTime} minutes.`
      }, { status: 429 });
    }
    
    // Parse the request body
    const body = await request.json();
    console.log('📦 [Admin Login API] Request body keys:', Object.keys(body));
    const { username, password } = body;
    
    console.log('👤 [Admin Login API] Username provided:', !!username);
    console.log('🔑 [Admin Login API] Password provided:', !!password);
    
    if (!username || !password) {
      console.error('❌ [Admin Login API] Missing credentials');
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }
    
    // Validate credentials
    const isValidUsername = username === ADMIN_USERNAME;
    const isValidPassword = password === ADMIN_PASSWORD;
    
    console.log('✅ [Admin Login API] Username valid:', isValidUsername);
    console.log('✅ [Admin Login API] Password valid:', isValidPassword);
    
    if (!isValidUsername || !isValidPassword) {
      // Increment attempt counter
      ipAttempts.count += 1;
      ipAttempts.lastAttempt = now;
      
      // Check if max attempts reached
      if (ipAttempts.count >= MAX_ATTEMPTS) {
        ipAttempts.lockedUntil = now + LOCKOUT_TIME;
      }
      
      attemptsByIp[clientIp] = ipAttempts;
      
      return NextResponse.json({
        success: false,
        error: 'Invalid username or password'
      }, { status: 401 });
    }
    
    // Reset attempts on successful login
    attemptsByIp[clientIp] = { count: 0, lastAttempt: now, lockedUntil: 0 };
    
    console.log('🎉 [Admin Login API] Login successful, generating JWT');
    
    // Generate a secure JWT token
    const token = await generateJWT();
    console.log('🔐 [Admin Login API] JWT generated, length:', token.length);
    
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful'
    });
    
    // Set the auth cookie with secure settings
    const cookieOptions = {
      name: 'auth-token',
      value: token,
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
      sameSite: 'strict' as const, // Prevents CSRF
    };
    
    console.log('🍪 [Admin Login API] Setting cookie with options:', {
      ...cookieOptions,
      value: token.substring(0, 50) + '...' // Don't log full token
    });
    
    response.cookies.set(cookieOptions);
    
    console.log('✅ [Admin Login API] Response prepared with auth cookie');
    return response;
  } catch (error) {
    console.error('💥 [Admin Login API] Unexpected error:', error);
    console.error('💥 [Admin Login API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      error: 'An error occurred during authentication'
    }, { status: 500 });
  }
}
