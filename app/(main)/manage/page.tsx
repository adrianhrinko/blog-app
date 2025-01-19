'use client';

import PostFeed from '@/components/PostFeed';
import { useAuth } from '@/providers/AuthContextProvider';
import { firestore } from '@/lib/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function ManagePostsPage() {
    const { user } = useAuth();
    const postsRef = collection(firestore, 'users', user?.uid || 'dummy', 'posts');
    const postsQuery = query(postsRef, orderBy('createdAt'));
    const [querySnapshot] = useCollection(postsQuery);

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage your Posts</h1>
        <PostFeed posts={posts} owner />
      </main>
    );
  }