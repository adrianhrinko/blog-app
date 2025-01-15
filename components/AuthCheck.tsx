"use client"

import { useAuth } from '@/providers/AuthContextProvider';
import Link from 'next/link';

// Component's children only shown to logged-in users
export default function AuthCheck(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    const { username } = useAuth();

  return username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}