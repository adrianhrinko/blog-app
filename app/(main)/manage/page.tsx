'use client';

import PostFeed from '@/components/PostFeed';
import { useAuth } from '@/providers/AuthContextProvider';
import { firestore } from '@/lib/firebase';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import DeleteDialog from '@/components/DeleteDialog';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function ManagePostsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const postsRef = collection(firestore, 'users', user?.uid || 'dummy', 'posts');
    const postsQuery = query(postsRef, orderBy('createdAt'));
    const [querySnapshot] = useCollection(postsQuery);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [slugToDelete, setSlugToDelete] = useState<string>('');

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    const handleDelete = async (slug: string) => {
      setSlugToDelete(slug);
      setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
      const postRef = doc(firestore, 'users', user?.uid || 'dummy', 'posts', slugToDelete);
      await deleteDoc(postRef);
      setShowDeleteDialog(false);
      toast({
        title: "Success!",
        description: "Your post has been deleted.",
      });
    };

    return (
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage your Posts</h1>
        <PostFeed posts={posts} showActions showAuthor={false} handleDelete={handleDelete} />
        <DeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={confirmDelete} />
      </main>
    );
  }