"use client"

import { useAuth } from '@/providers/AuthContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from './Spinner';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const { user, username, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/auth/signin');
        } else if (!username) {
          router.push('/auth/username');
        }
      }
    }, [user, username, loading]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size={48} className="text-primary" />
        </div>
      );
    }

    if (user && username) {
      return children;
    }

    return null;
}