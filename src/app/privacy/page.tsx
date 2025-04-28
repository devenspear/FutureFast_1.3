'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const [content, setContent] = useState<string>('');
  const router = useRouter();
  
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);
  
  // Fetch the privacy content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/legal/privacy');
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        } else {
          setContent('<p>Unable to load Privacy Policy. Please try again later.</p>');
        }
      } catch (error) {
        console.error('Error loading privacy policy:', error);
        setContent('<p>Unable to load Privacy Policy. Please try again later.</p>');
      }
    };
    
    fetchContent();
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-900 border border-purple-800/40 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white font-orbitron">Privacy Policy</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow text-gray-300">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-900 text-white rounded-md hover:from-purple-600 hover:to-indigo-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
