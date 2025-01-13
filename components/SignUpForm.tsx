"use client"
import { signUpWithEmail } from '@/lib/firebase';
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
import ButtonWLoader from './ButtonWLoader';
import { useState, useCallback } from 'react';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM_STATE: FormData = {
  email: '',
  password: '',
  confirmPassword: ''
};

const INITIAL_ERROR_STATE: FormErrors = {
  email: '',
  password: '',
  confirmPassword: ''
};

export default function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERROR_STATE);

  const validateForm = useCallback((): boolean => {
    const { email, password, confirmPassword } = formData;
    const newErrors: FormErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  }, [formData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password);
      // Successful signup will automatically redirect via Firebase Auth
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          email: error.message
        }));
      }
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(errors.email && "border-red-500")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500" role="alert">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  name="password" 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(errors.password && "border-red-500")}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500" role="alert">{errors.password}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword" 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(errors.confirmPassword && "border-red-500")}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="text-sm text-red-500" role="alert">{errors.confirmPassword}</p>
                )}
              </div>
              <ButtonWLoader 
                loading={loading} 
                type="submit" 
                className="w-full"
              >
                Sign up
              </ButtonWLoader>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
