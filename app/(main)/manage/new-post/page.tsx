'use client';

import AuthCheck from '@/components/AuthCheck';
import { useAuth } from '@/providers/AuthContextProvider';
import PostManager from '@/components/PostManager';

export default function ManagePostEdit() {
  const { user } = useAuth();

  return (
    <AuthCheck>
        <PostManager user={user} />
    </AuthCheck>
  );
}