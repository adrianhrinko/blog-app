"use client"
import { useAuth } from '@/providers/AuthContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UsernameForm from '@/components/auth/UsernameForm';

export default function UsernamePage() {
  const { user, username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && username) {
      router.push('/manage');
    }

    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, username, router]);

  return <UsernameForm />;
}