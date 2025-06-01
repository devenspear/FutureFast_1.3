import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Token validation function (same as in middleware)
function isValidToken(token: string | undefined): boolean {
  // In production, this would validate the token structure, expiration, and signature
  // For now, we're just checking that a token exists and has sufficient length
  if (!token) return false;
  return token.length >= 32;
}

export async function GET() {
  // Get the cookie store
  const cookieStore = await cookies();
  
  // Get the auth token
  const token = cookieStore.get('auth-token')?.value;
  
  // Validate the token
  const authenticated = isValidToken(token);
  
  return NextResponse.json({
    authenticated
  });
}
