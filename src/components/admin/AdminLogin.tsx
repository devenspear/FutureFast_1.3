'use client';

import { useState, useEffect } from 'react';
import { checkAuthStatus } from '@/lib/auth-utils';

export default function AdminLogin({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      const isAuth = await checkAuthStatus();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    }
    
    checkAuth();
  }, []);
  
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Use absolute URL to avoid issues with relative paths
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
        <p className="text-gray-300 mb-6">
          You need to be authenticated to access the admin dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
        >
          Login as Admin
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
}
