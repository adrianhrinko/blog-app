
import { doc, getDoc } from 'firebase/firestore';
import { firestore, getUserWithUsername, postToJSON } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import PostPageContent from '@/components/PostPageContent';

interface Post {
  slug: string;
  uid: string;
  heartCount?: number;
  username: string;
  content?: string;
  title?: string;
  createdAt: number | { toDate: () => Date };
}

async function getData(username: string, slug: string) {
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    notFound();
  }
  
  let post: Post | null = null;
  let path: string | null = null;

  if (userDoc) {
    const postRef = doc(firestore, 'users', userDoc.id, 'posts', slug);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      post = postToJSON(postDoc);
      path = postRef.path;
    }
  }

  if (!post || !path) {
    notFound();
  }

  return { post, path };
}

export default async function PostPage({ 
  params 
}: { 
  params: { username: string; slug: string } 
}) {
  const { username, slug } = await params;
  const { post, path } = await getData(username, slug);

  return <PostPageContent initialPost={post} path={path} />;
}

