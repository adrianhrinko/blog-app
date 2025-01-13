"use client"
import SignInForm from '@/components/SignInForm';
import UsernameForm from '@/components/UsernameForm';
import { useAuth } from '@/providers/AuthContextProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
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
          <SignInForm />
        )}
      </div>
    </main>
  );
}