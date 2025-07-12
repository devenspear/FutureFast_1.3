'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen admin-bg-primary flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="admin-card p-8 admin-shadow-lg">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold admin-text-error mb-4 font-orbitron">
            Something went wrong!
          </h2>
          
          <div className="admin-alert admin-alert-error mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="font-medium">Error Details</p>
                <p className="text-sm opacity-90 mt-1">
                  {error.message || 'An unexpected error occurred. Please try again later.'}
                </p>
                {error.digest && (
                  <p className="text-xs opacity-75 mt-2 admin-code">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={reset}
              className="admin-btn w-full py-3 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Try Again</span>
            </button>
            
            <Link
              href="/admin"
              className="admin-btn admin-btn-secondary w-full py-3 flex items-center justify-center space-x-2 text-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              <span>Go to Admin Dashboard</span>
            </Link>
            
            <Link
              href="/"
              className="admin-nav-link text-sm flex items-center justify-center space-x-2 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
        
        {/* Additional Help */}
        <div className="admin-card p-4">
          <h3 className="font-semibold admin-text-primary mb-2">Need Help?</h3>
          <p className="text-sm admin-text-muted">
            If this error persists, please contact the system administrator or check the server logs for more details.
          </p>
        </div>
      </div>
    </div>
  );
}
