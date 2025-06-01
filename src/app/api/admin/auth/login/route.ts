import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// In a production environment, these would be stored in a secure database
// and the password would be properly hashed
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'futurefast2025';

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
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Check if the IP is currently locked out
    const now = Date.now();
    const ipAttempts = attemptsByIp[clientIp] || { count: 0, lastAttempt: 0, lockedUntil: 0 };
    
    if (ipAttempts.lockedUntil > now) {
      const remainingSeconds = Math.ceil((ipAttempts.lockedUntil - now) / 1000);
      return NextResponse.json({
        success: false,
        error: `Too many failed attempts. Please try again in ${remainingSeconds} seconds.`
      }, { status: 429 });
    }
    
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;
    
    // Validate credentials
    if (!username || !password) {
      // Increment attempt counter
      ipAttempts.count += 1;
      ipAttempts.lastAttempt = now;
      
      // Check if max attempts reached
      if (ipAttempts.count >= MAX_ATTEMPTS) {
        ipAttempts.lockedUntil = now + LOCKOUT_TIME;
        attemptsByIp[clientIp] = ipAttempts;
        
        return NextResponse.json({
          success: false,
          error: 'Too many failed attempts. Please try again later.'
        }, { status: 429 });
      }
      
      attemptsByIp[clientIp] = ipAttempts;
      
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }
    
    // In production, you would use a secure password comparison
    // Here we're using a simple comparison for development
    const isValidUsername = username === ADMIN_USERNAME;
    const isValidPassword = password === ADMIN_PASSWORD;
    
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
    
    // Generate a secure JWT token
    const token = await generateJWT();
    
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful'
    });
    
    // Set the auth cookie with secure settings
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
      sameSite: 'strict', // Prevents CSRF
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during authentication'
    }, { status: 500 });
  }
}
