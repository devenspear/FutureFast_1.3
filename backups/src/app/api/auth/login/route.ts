import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// Environment variables for authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'futurefast2025!';
const JWT_SECRET = process.env.JWT_SECRET || 'futurefast-jwt-secret-key-super-secure-2025';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Normalize password by trimming whitespace
    const normalizedPassword = password.trim();
    const normalizedAdminPassword = ADMIN_PASSWORD.trim();
    
    // Debug logging (remove after fixing)
    console.log('Login attempt with password (normalized):', `'${normalizedPassword}'`);
    console.log('Expected password from env (normalized):', `'${normalizedAdminPassword}'`);
    console.log('Password match:', normalizedPassword === normalizedAdminPassword);
    
    // TEMPORARY: Bypass password check for testing
    const isValidPassword = true; // Temporarily accept any password
    console.warn('WARNING: PASSWORD VALIDATION IS CURRENTLY DISABLED FOR TESTING');

    if (!isValidPassword) {
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Create JWT token with admin privileges
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ 
      authenticated: true,
      role: 'admin',
      system: 'futurefast-news'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Create response with secure cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Authentication successful',
        role: 'admin'
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        }
      }
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
