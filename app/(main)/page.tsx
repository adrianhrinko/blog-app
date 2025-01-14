import { firestore, postToJSON } from '@/lib/firebase';
import { getDocs, limit, orderBy, query, startAfter, where, collectionGroup } from 'firebase/firestore';
import ClientPosts from '@/components/ClientPosts';

// Max post to query per page
const LIMIT = 1;

// Server-side posts fetching
async function getPostsAsync() {
  const postsQuery = query(
    collectionGroup(firestore, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );

  return (await getDocs(postsQuery)).docs.map(postToJSON);
}

// Server Component
export default async function HomePage() {
  const posts = await getPostsAsync();
  
  return <ClientPosts initialPosts={posts} />;
}