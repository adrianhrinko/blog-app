'use client';

import PostFeed from '@/components/PostFeed';
import { useAuth } from '@/providers/AuthContextProvider';
import { firestore } from '@/lib/firebase';
import { collection, doc, orderBy, query, setDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import AuthCheck from '@/components/AuthCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const { user } = useAuth();
  const postsRef = collection(firestore, 'users', user?.uid || 'dummy', 'posts');
  const postsQuery = query(postsRef, orderBy('createdAt'));
  const [querySnapshot] = useCollection(postsQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { user, username } = useAuth();
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = user?.uid;
    
    if (!uid || !username) return;

    const postRef = doc(firestore, 'users', uid, 'posts', slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      heartCount: 0,
    };

    await setDoc(postRef, data);

    // TODO: SUCCESS TOAST

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        <strong>Slug:</strong> {slug}
      </div>
      <Button 
        type="submit" 
        disabled={!isValid}
        className="w-full"
      >
        Create New Post
      </Button>
    </form>
  );
}