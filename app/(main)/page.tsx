import { firestore, postToJSON } from '@/lib/firebase';
import { getDocs, limit, orderBy, query, where, collectionGroup } from 'firebase/firestore';
import ClientPosts from '@/components/ClientPosts';
import { Metadata } from 'next';
import generateMetadata from '@/lib/metatags';

export const metadata: Metadata = generateMetadata({
  title: "Home | FEED",
  description: "Share your thoughts or knowledge with the world"
})

// Max post to query per page
const LIMIT = 5;

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