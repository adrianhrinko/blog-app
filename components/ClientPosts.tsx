'use client';

import { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import PostFeed from '@/components/PostFeed';
import { firestore, fromMillis, postToJSON } from '@/lib/firebase';
import { getDocs, limit, orderBy, query, startAfter, where, collectionGroup } from 'firebase/firestore';

const LIMIT = 1;

export default function ClientPosts({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const postsQuery = query(
      collectionGroup(firestore, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <PostFeed posts={posts} owner={false} />

      <div className="flex justify-center py-8">
        {loading && <Spinner show={loading} />}
        {postsEnd && <p className="text-gray-500">You have reached the end!</p>}
      </div>
    </main>
  );
} 