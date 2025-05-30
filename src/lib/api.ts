export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    // No Authorization header needed here, browser will send HttpOnly cookie
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies (like auth-token) are sent with the request
    });
  
    if (!response.ok) {
      const responseText = await response.text(); // Get raw text of the error response
      console.error('Raw error response from API:', responseText);
      // Attempt to parse as JSON, but fall back to text if it fails
      try {
        const errorJson = JSON.parse(responseText);
        // Use a more specific error message if available from the parsed JSON
        const message = errorJson.message || errorJson.error || `API request failed with status: ${response.status}`;
        console.error('API Error Message:', message);
        throw new Error(message);
      } catch (e: any) {
        // If JSON.parse fails or another error occurs, throw an error with the raw text or original error
        const errorMessage = e instanceof Error && e.message.startsWith('API request failed:') ? e.message : `API request failed: ${response.status} - ${responseText}`;
        console.error('Fallback API Error:', errorMessage);
        throw new Error(errorMessage);
      }
    }

    // Check if the response has content before trying to parse as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    // If no content or not JSON, return the response object itself or handle as needed
    // For now, returning null or an empty object might be safer if no JSON body is expected for some OK responses.
    // Or, if text is expected for some OK responses:
    // return response.text(); 
    return response.text().then(text => text ? JSON.parse(text) : {}); // Attempt to parse text, fallback to empty object

  } catch (error) {
    console.error('Fetch API call failed:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
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
