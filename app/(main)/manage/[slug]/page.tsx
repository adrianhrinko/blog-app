'use client';

import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, notFound } from 'next/navigation';
import { useAuth } from '@/providers/AuthContextProvider';
import PostManager from '@/components/PostManager';
import { useEffect } from 'react';
import { useState } from 'react';

export default function ManagePostEdit() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const postRef = doc(firestore, 'users', user?.uid || 'dummy', 'posts', slug as string);

  useEffect(() => {
    const fetchPost = async () => {
      const snapshot = await getDoc(postRef);
      setPost(snapshot.data());
      setLoading(false);
    };
    fetchPost();
  }, [postRef]);

  if (!loading && !post) {
    notFound();
  }

  return (
    post && <PostManager post={post} postRef={postRef} user={user} />
  );
}