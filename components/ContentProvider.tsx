import React from 'react';
import { getWhyWeExistContent, getAboutMeContent } from '../lib/content';

// This is a server component that loads the content from markdown files
// and passes it to the client components via props
export default function ContentProvider() {
  // Load content from markdown files on the server
  const whyWeExistContent = getWhyWeExistContent();
  const aboutMeContent = getAboutMeContent();

  // Store the content in a global variable that client components can access
  // This is a simple approach for now - in a production app, you'd use a proper state management solution
  if (typeof window !== 'undefined') {
    (window as any).__CONTENT__ = {
      whyWeExistContent,
      aboutMeContent
    };
  }

  return null; // This component doesn't render anything
}
