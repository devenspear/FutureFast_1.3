import { NextRequest, NextResponse } from 'next/server';
import { saveSubscriber, checkEmailExists } from '../../../../lib/blob';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, email, company } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, message: 'First name, last name, and email are required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    // Save the subscriber to Blob Storage
    const result = await saveSubscriber(firstName, lastName, email, company || '');

    // Return the result
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
