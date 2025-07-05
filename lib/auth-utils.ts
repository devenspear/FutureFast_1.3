'use server';

import { cookies } from 'next/headers';

// Simple authentication utility for development purposes
// In production, this would be replaced with a proper authentication system

export async function setAuthCookie() {
  // Set a development auth token cookie that lasts for 7 days
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth-token',
    value: 'dev-admin-token',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has('auth-token');
}

// For client components that need to check auth status
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/auth/status', {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.authenticated === true;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
}
