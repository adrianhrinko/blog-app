import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { postToJSON } from "@/lib/firebase";
import { firestore } from "@/lib/firebase";
import { getDocs, query } from "firebase/firestore";
import { limit, orderBy } from "firebase/firestore";
import { getUserWithUsername } from "@/lib/firebase";
import { collection, where } from "firebase/firestore";
import { notFound } from "next/navigation";
import generateMetadata from "@/lib/metatags";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Profile | FEED",
})

async function getData(username: string) {
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    notFound();
  }

  const user = userDoc.data();
  const postsQuery = query(
    collection(firestore, 'users', userDoc.id, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(5)
  );
  const querySnapshot = await getDocs(postsQuery);
  const posts = querySnapshot.docs.map(postToJSON);

  return { user, posts };
}

export default async function UserPage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const { username } = await params;
  const { user, posts } = await getData(username);

  return (
    <div>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false}/>  
    </div>
  );
}