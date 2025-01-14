"use client"
import { anonymousSignIn, signInWithEmail, signInWithGoogle } from '@/lib/firebase';
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ButtonWLoader from '../ButtonWLoader';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()  
    setLoading(true);

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      await signInWithEmail(email, password)
      // Successful login will automatically redirect via Firebase Auth
    } catch (err: any) {
      console.error(err.message)
      // Handle error appropriately
    }
    setLoading(false);
  }
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  }

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    await anonymousSignIn();
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password"
                  name="password" 
                  type="password" 
                  required
                />
              </div>
              <ButtonWLoader loading={loading} type="submit" className="w-full">
                Sign in
              </ButtonWLoader>
              <ButtonWLoader loading={loading} onClick={handleGoogleSignIn} variant="outline" className="w-full">
                Sign in with Google
              </ButtonWLoader>
              <ButtonWLoader loading={loading} onClick={handleAnonymousSignIn} variant="outline" className="w-full">
                Sign in anonymously
              </ButtonWLoader>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
