import { sql } from '@vercel/postgres';

export async function addSubscriber(firstName: string, lastName: string, email: string, company: string) {
  try {
    // Check if the email already exists
    const existingUser = await sql`
      SELECT email FROM newsletter_subscribers WHERE email = ${email}
    `;

    // If the email already exists, return an error
    if (existingUser.rows.length > 0) {
      return { success: false, message: 'This email is already subscribed to our newsletter.' };
    }

    // Insert the new subscriber
    await sql`
      INSERT INTO newsletter_subscribers (first_name, last_name, email, company)
      VALUES (${firstName}, ${lastName}, ${email}, ${company})
    `;

    return { success: true, message: 'Thank you for subscribing to our newsletter!' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'An error occurred while processing your subscription. Please try again later.' };
  }
}

export async function getSubscribers() {
  try {
    const subscribers = await sql`
      SELECT * FROM newsletter_subscribers ORDER BY created_at DESC
    `;
    return subscribers.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}
