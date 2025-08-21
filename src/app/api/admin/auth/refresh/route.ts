import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the auth cookie
  const response = NextResponse.json({ message: 'Session refreshed' });
  
  response.cookies.delete('admin-auth');
  
  return response;
}