'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

export default function GoogleLoginButton() {
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isLoading) {
    return (
      <div className="px-3 py-2 bg-gray-100 rounded-md text-xs text-gray-600">
        Loading...
      </div>
    );
  }

  if (user) {
    const handleSignOut = async () => {
      setIsSigningOut(true);
      try {
        await signOut();
      } catch (err) {
        console.error('Sign out failed:', err);
      } finally {
        setIsSigningOut(false);
      }
    };

    return (
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-xs text-gray-600">
          <span className="font-medium">{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 text-gray-600" />
        </button>
      </motion.div>
    );
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <motion.button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-blue-600 text-white text-xs font-sans font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 uppercase tracking-wider"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Sign In with Google
    </motion.button>
  );
}
