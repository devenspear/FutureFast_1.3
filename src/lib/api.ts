export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers);
  
  // In a server component, you would get the token from the request cookies
  // For client-side, the cookie will be sent automatically with credentials: 'include'
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  
  return response;
}

export async function postWithAuth(
  url: string,
  data: any,
  options: RequestInit = {}
) {
  return fetchWithAuth(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}

// Server-side helper to get the auth token from cookies
export function getAuthToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies['auth-token'];
}
