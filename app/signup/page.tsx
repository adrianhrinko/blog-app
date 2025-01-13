"use client"
import { useAuth } from '@/providers/AuthContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignUpForm from '@/components/SignUpForm';
import UsernameForm from '@/components/UsernameForm';

export default function SignUpPage() {
  const { user, username } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && username) {
      router.push('/');
    }
  }, [user, username, router]);

  return (
    <main className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {user ? (
          !username ? <UsernameForm /> : null
        ) : (
          <SignUpForm />
        )}
      </div>
    </main>
  );
}