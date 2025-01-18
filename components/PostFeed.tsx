import Link from 'next/link';
import AvatarComponent from './Avatar';
import { HeartIcon } from 'lucide-react';

export default function PostFeed({ posts, owner } : { posts: any, owner: any }) {
  return posts ? posts.map((post: any) => <PostItem post={post} key={post.slug} owner={owner} />) : null;
}

function PostItem({ post, owner: owner = false } : { post: any, owner: any }) {

  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <Link href={`/${post.username}/${post.slug}`}>
      <article className="flex gap-6 py-6 border-b border-gray-100 hover:bg-gray-50">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/${post.username}`}>
              <AvatarComponent user={post.user} username={post.username} className="h-6 w-6" />
            </Link>
            <Link href={`/${post.username}`}>
              <span className="text-sm font-medium">
                <span className="text-muted-foreground">by</span>{' '}
                <span className="hover:underline">@{post.username}</span>
              </span>
            </Link>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{minutesToRead} min read</span>
          </div>

          <h2 className="text-xl font-bold mb-2 line-clamp-2">
            {post.title}
          </h2>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <HeartIcon className="h-4 w-4" /> {post.heartCount || 0}
              </span>
              <span className="text-muted-foreground">{wordCount} words</span>
            </div>

            {owner && (
              <div className="flex items-center gap-3">
                <Link href={`/manage/${post.slug}`} onClick={(e) => e.stopPropagation()}>
                  <button className="text-sm text-primary hover:underline">
                    Edit
                  </button>
                </Link>
                <span className={post.published ? "text-green-500" : "text-red-500"}>
                  {post.published ? "Live" : "Unpublished"}
                </span>
              </div>
            )}
          </div>
        </div>

        {post.imageUrl && (
          <div className="w-32 h-32 flex-shrink-0">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </article>
    </Link>
  );
}