'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAuthToken } from '@/lib/auth';

export function useAuth(redirectToLogin = true) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];

        if (!token) {
          throw new Error('No auth token found');
        }

        const { isValid } = await verifyAuthToken(token);
        setIsAuthenticated(isValid);
        
        if (!isValid && redirectToLogin) {
          router.push('/admin/login');
        }
      } catch {
        setIsAuthenticated(false);
        if (redirectToLogin) {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [redirectToLogin, router]);

  return { isAuthenticated, isLoading };
}
