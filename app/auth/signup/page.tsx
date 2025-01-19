"use client"
import { useAuth } from '@/providers/AuthContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  const { user, username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(username ? '/manage' : '/auth/username');
    }
  }, [user, username, router]);

  return <SignUpForm />;
}