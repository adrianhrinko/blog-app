import Link from 'next/link';
import AvatarComponent from './Avatar';
import { HeartIcon, Trash2Icon, PencilIcon, ImageIcon } from 'lucide-react';

export default function PostFeed({ posts, showActions = false, showAuthor = true, handleDelete } : { posts: any, showActions: boolean, showAuthor?: boolean, handleDelete?: (slug: string) => void }) {

  return posts ? posts.map((post: any) => (
    <PostItem post={post} key={post.slug} showActions={showActions} showAuthor={showAuthor} handleDelete={handleDelete} />
  )) : null;
  }

function PostItem({ post, showActions = false, showAuthor, handleDelete } : { post: any, showActions: boolean, showAuthor: boolean, handleDelete?: (slug: string) => void  }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  // Extract first image URL from markdown content
  const imageUrl = post.content.match(/!\[.*?\]\((.*?)\)/)?.[1];

  return (
    <div className="relative">
      <Link href={`/${post.username}/${post.slug}`} className="absolute inset-x-0 top-[5%] h-[90%] z-10 cursor-pointer" />
      <article className="flex gap-6 py-6 border-b border-gray-100">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            {showActions ? (
              <span className={post.published ? "text-green-500" : "text-red-500"}>
                {post.published ? "Live" : "Unpublished"}
              </span>
            ) : showAuthor && (
              <>
                <Link href={`/${post.username}`} onClick={(e) => e.stopPropagation()} className="relative z-20">
                  <AvatarComponent photoUrl={post.userAvatarUrl} username={post.username} className="h-6 w-6" />
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
          {post.subtitle && (
            <p className="text-muted-foreground mb-2 line-clamp-2">
              {post.subtitle}
            </p>
          )}

          <div className="flex-grow" />

          <div className="flex items-center justify-between text-sm mt-auto">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <HeartIcon className="h-4 w-4" /> {post.heartCount || 0}
              </span>
              <span className="text-muted-foreground">{wordCount} words · {minutesToRead} min read</span>
            </div>

            {showActions && (
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

        <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={post.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}