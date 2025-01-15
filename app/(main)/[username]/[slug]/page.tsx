import { doc, getDoc } from 'firebase/firestore';
import { firestore, getUserWithUsername, postToJSON } from '@/lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '@/components/PostContent';
import { useAuth } from '@/providers/AuthContextProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { notFound } from 'next/navigation';

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
  const { username, slug } = params;
  const { post: initialPost, path } = await getData(username, slug);
  
  return <PostPageContent initialPost={initialPost} path={path} />;
}

function PostPageContent({ 
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