'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  // Show a loading spinner while checking authentication
  if (loading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Render the protected content if authenticated
  return <>{children}</>;
}