import { NextRequest, NextResponse } from 'next/server';
import { saveSubscriber, checkEmailExists } from '../../../../lib/blob';

// NOTE: Previous attempts to implement Cloudflare Turnstile for form security were made
// but encountered integration issues. This is a simplified version without Turnstile for now.

export async function POST(request: NextRequest) {
  console.log('API route called: /api/subscribe');
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Request body received:', body);
    const { firstName, lastName, email, company } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { success: false, message: 'First name, last name, and email are required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // NOTE: Turnstile verification was removed in this version

    // Check if email already exists
    console.log('Checking if email exists:', email);
    const emailExists = await checkEmailExists(email);
    console.log('Email exists check result:', emailExists);
    if (emailExists) {
      console.log('Email already exists');
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    // Save the subscriber to Blob Storage
    console.log('Saving subscriber data to Blob Storage');
    const result = await saveSubscriber(firstName, lastName, email, company || '');
    console.log('Save result:', result);

    // Return the result
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('API error details:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
