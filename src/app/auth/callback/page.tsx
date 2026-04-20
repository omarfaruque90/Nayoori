'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current session which will be set after OAuth redirect
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          // Session established, redirect to checkout
          router.push('/checkout');
        } else {
          setError('No session found. Authentication failed.');
          setTimeout(() => router.push('/'), 3000);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-beige to-white">
      <div className="text-center">
        {error ? (
          <>
            <h1 className="font-serif text-3xl text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting home...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="font-serif text-2xl text-gray-900 mb-2">Completing Sign In</h1>
            <p className="text-gray-600">Please wait while we authenticate your account...</p>
          </>
        )}
      </div>
    </div>
  );
}
