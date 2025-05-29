export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers);

  // Add Authorization header if token exists in localStorage (client-side)
  if (typeof window !== 'undefined') { // Check if running in browser
    const token = localStorage.getItem('auth-token'); // Assuming token is stored here
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    // credentials: 'include', // Keep if other parts of API use cookies, remove if not needed.
                              // For Bearer token auth, this is not strictly necessary for the auth part.
  });
  
  if (!response.ok) {
    const responseText = await response.text(); // Get raw text of the error response
    console.error('Raw error response from API:', responseText); // Log it for debugging

    try {
      const errorPayload = JSON.parse(responseText); // Attempt to parse it as JSON
      // Use the 'error' property from our API, then 'message', then a generic message
      throw new Error(errorPayload.error || errorPayload.message || `API Error: ${response.status}`);
    } catch (e) {
      // If JSON.parse fails or if it's not JSON
      console.error('Failed to parse error response as JSON:', e);
      // Fallback to a message including the raw text if it's short, or just status
      const fallbackMessage = responseText.length < 100 ? responseText : `API Error: ${response.status}`;
      throw new Error(fallbackMessage || 'An unknown error occurred');
    }
  }
  
  return response;
}

export async function postWithAuth<T = unknown>(
  url: string,
  data: T,
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
