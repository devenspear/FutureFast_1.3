import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a response that will redirect to the login page
    const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    
    // Clear the auth cookie
    response.cookies.delete({
      name: 'auth-token',
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during logout'
    }, { status: 500 });
  }
}
