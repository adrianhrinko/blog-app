'use client';

import AuthCheck from '@/components/AuthCheck';
import { firestore } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useAuth } from '@/providers/AuthContextProvider';
import PostManager from '@/components/PostManager';

export default function ManagePostEdit() {
  const { slug } = useParams();
  const { user } = useAuth();
  const postRef = doc(firestore, 'users', user?.uid || 'dummy', 'posts', slug as string);
  const [snapshot] = useDocument(postRef);
  const post = snapshot?.data();

  return (
    <AuthCheck>
      { post && <PostManager post={post} postRef={postRef} user={user} /> } 
    </AuthCheck>
  );
}