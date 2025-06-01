import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'futurefast-jwt-secret-key-super-secure-2025';

export async function verifyAuthToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { isValid: true, payload };
  } catch {
    return { isValid: false, error: 'Invalid or expired token' };
  }
}

export function getAuthToken(cookies: { get: (name: string) => { value: string } | undefined }) {
  return cookies.get('auth-token')?.value;
}
