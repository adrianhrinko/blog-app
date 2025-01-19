'use client';

import { firestore } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "./PostContent";

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
  
    const post = (realtimePost as Post) || initialPost;

    return (
      <main className="max-w-2xl mx-auto p-4">
          <PostContent post={post} path={path}/>
      </main>
    );
  }