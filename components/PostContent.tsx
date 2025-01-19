import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import AvatarComponent from './Avatar';
import { User } from 'firebase/auth';
import rehypeRaw from 'rehype-raw';
import HeartComponent from './Heart';

interface Post {
  title?: string;
  subtitle?: string;
  username: string;
  content?: string;
  createdAt?: number | { toDate: () => Date };
  heartCount?: number;
  user?: User;
}

// UI component for main post content
export default function PostContent({ post, preview = false, path }: { post: any, preview?: boolean, path?: string }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt?.toDate();

  return (
    <article className="flex flex-col gap-4 py-6 border-b border-gray-100">
      <h1 className="text-4xl font-bold">{post?.title}</h1>
      <p className="text-xl text-muted-foreground">{post?.subtitle}</p>
      
      {!preview && (
        <>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link href={`/${post.username}/`}>
                <AvatarComponent photoUrl={post.user?.photoURL} username={post.username} className="h-10 w-10" />
              </Link>
              <Link href={`/${post.username}/`} className="font-medium text-black hover:underline">
                @{post.username}
              </Link>
            </div>
            <span>·</span>
            <time dateTime={createdAt.toISOString()}>
              {createdAt.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          <div className="border-y border-gray-100 py-4">
            <div className="flex items-center gap-4">
              {path && post?.heartCount !== undefined && (
                <HeartComponent postPath={path} heartCount={post.heartCount} />
              )}
            </div>
          </div>
        </>
      )}
      
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">{post?.content}</ReactMarkdown>
      </div>
    </article>
  );
}