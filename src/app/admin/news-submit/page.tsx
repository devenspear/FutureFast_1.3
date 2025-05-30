'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { postWithAuth } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function NewsSubmitForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  
  const { handleSubmit, isSubmitting, error } = useFormSubmit(
    async (formData: { url: string; notes: string }) => {
      const response = await postWithAuth('/api/admin/news/submit', formData);
      return response.json();
    },
    () => {
      // Reset form on success
      setUrl('');
      setNotes('');
    }
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">FutureFast.AI Admin</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Submit News Article</h2>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit({ url, notes });
                    }} 
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        Article URL *
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="url"
                          required
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="https://example.com/news/article"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes (Optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="Any specific instructions or notes about this article..."
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{typeof error === 'string' ? error : (error as Error)?.message || 'An unknown error occurred'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Processing...
                          </>
                        ) : 'Submit Article'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function NewsSubmitPage() {
  return (
    <ProtectedRoute>
      <NewsSubmitForm />
    </ProtectedRoute>
  );
}
