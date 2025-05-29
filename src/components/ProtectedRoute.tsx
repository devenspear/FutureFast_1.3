'use client';

import { ReactNode } from 'react';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const { isAuthenticated, isLoading } = useAuth(true);
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push('/admin/login');
  //   }
  // }, [isAuthenticated, isLoading, router]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return null;
  // }

  // Temporarily rendering children directly to test form functionality
  return <>{children}</>;
}
