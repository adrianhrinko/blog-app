"use client"
import SignInForm from '@/components/auth/SignInForm';
import UsernameForm from '@/components/auth/UsernameForm';
import { useAuth } from '@/providers/AuthContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { user, username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(username ? '/manage' : '/auth/username');
    }
  }, [user, username, router]);

  return <SignInForm />;
}