import Link from 'next/link';
import AvatarComponent from './Avatar';
import { HeartIcon, Trash2Icon, PencilIcon } from 'lucide-react';

export default function PostFeed({ posts, owner, showAuthor = true, handleDelete } : { posts: any, owner: any, showAuthor?: boolean, handleDelete?: (slug: string) => void }) {

  return posts ? posts.map((post: any) => (
    <PostItem post={post} key={post.slug} owner={owner} showAuthor={showAuthor} handleDelete={handleDelete} />
  )) : null;
  }

function PostItem({ post, owner: owner = false, showAuthor, handleDelete } : { post: any, owner: any, showAuthor: boolean, handleDelete?: (slug: string) => void  }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="relative">
      <Link href={`/${post.username}/${post.slug}`} className="absolute inset-x-0 top-[5%] h-[90%] z-10 cursor-pointer" />
      <article className="flex gap-6 py-6 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {owner ? (
              <span className={post.published ? "text-green-500" : "text-red-500"}>
                {post.published ? "Live" : "Unpublished"}
              </span>
            ) : showAuthor && (
              <>
                <Link href={`/${post.username}`} onClick={(e) => e.stopPropagation()} className="relative z-20">
                  <AvatarComponent user={post.user} username={post.username} className="h-6 w-6" />
                </Link>
                <Link href={`/${post.username}`} onClick={(e) => e.stopPropagation()} className="relative z-20">
                  <span className="text-sm font-medium">
                    <span className="text-muted-foreground">by</span>{' '}
                    <span className="hover:underline">@{post.username}</span>
                  </span>
                </Link>
                <span className="text-sm text-muted-foreground">·</span>
              </>
            )}
          </div>

          <h2 className="text-xl font-bold mb-2 line-clamp-2">
            {post.title}
          </h2>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <HeartIcon className="h-4 w-4" /> {post.heartCount || 0}
              </span>
              <span className="text-muted-foreground">{wordCount} words · {minutesToRead} min read</span>
            </div>

            {owner && (
              <div className="flex items-center gap-3 relative z-20">
                <Link href={`/manage/${post.slug}`} onClick={(e) => e.stopPropagation()}>
                  <button className="text-sm flex items-center gap-1 hover:underline">
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                </Link>
                <button 
                  onClick={(e) => {
                    handleDelete?.(post.slug); 
                  }}
                  className="text-sm text-red-500 flex items-center gap-1 hover:underline"
                >
                  <Trash2Icon className="h-4 w-4" />
                  Delete
                </button>
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
    </div>
  );
}