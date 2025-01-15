import { getUserWithUsername } from '@/lib/firebase';
import { firestore, postToJSON } from '@/lib/firebase';
import { collection, collectionGroup, doc, DocumentData, getDoc, getDocs } from 'firebase/firestore';
import PostContent from '@/components/PostContent';

interface Params {
  username: string;
  slug: string;
}

interface Post {
  slug: string;
  username: string;
  [key: string]: any;
}

interface Props {
  post: Post;
  path: string;
}

export const revalidate = 5000;
export const dynamicParams = true;

// In Next.js 13+, getStaticProps and getStaticPaths are replaced with generateMetadata, 
// generateStaticParams and default async Server Components
export async function generateStaticParams() {
  const snapshot = await getDocs(collectionGroup(firestore, 'posts'));

  return snapshot.docs.map((doc: DocumentData) => {
    const { slug, username } = doc.data();
    return {
      username,
      slug,
    };
  });
}

export default async function Post({ params }: { params: Params }) {
  const { username, slug } = await params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(collection(userDoc.ref, 'posts'), slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return (
    <main className="max-w-4xl mx-auto">
      <PostContent post={post} />
    </main>
  );
}