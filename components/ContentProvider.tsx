"use client";

// This is a client component that provides content
export default function ContentProvider() {
  // Store the content in a global variable that client components can access
  // This is a simple approach for now - in a production app, you'd use a proper state management solution
  if (typeof window !== 'undefined') {
    (window as Window & { __CONTENT__?: Record<string, unknown> }).__CONTENT__ = {
      // Content would be loaded here in a production app
    };
  }

  return null; // This component doesn't render anything
}
