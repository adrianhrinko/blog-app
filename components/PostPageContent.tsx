'use client';

import { firestore } from "@/lib/firebase";
import { useAuth } from "@/providers/AuthContextProvider";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "./PostContent";
import { Card } from "./ui/card";
import { Link } from "lucide-react";
import { Button } from "./ui/button";

interface Post {
    slug: string;
    uid: string;
    heartCount?: number;
    username: string;
    content?: string;
    title?: string;
    createdAt: number | { toDate: () => Date };
  }

export default function PostPageContent({ 
    initialPost,
    path 
  }: {
    initialPost: Post;
    path: string;
  }) {
    const postRef = doc(firestore, path);
    const [realtimePost] = useDocumentData(postRef);
    const { user } = useAuth();
  
    const post = (realtimePost as Post) || initialPost;
  
    return (
      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        <section className="md:col-span-2">
          <PostContent post={post} />
        </section>
  
        <Card className="p-4 h-fit">
          <p className="font-bold mb-4">
            {post.heartCount || 0} 🤍
          </p>
  
          {user?.uid === post.uid && (
            <Link href={`/admin/${post.slug}`}>
              <Button variant="default">Edit Post</Button>
            </Link>
          )}
        </Card>
      </main>
    );
  }