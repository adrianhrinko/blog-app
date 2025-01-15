import Link from 'next/link';

export default function PostFeed({ posts, admin } : { posts: any, admin: any }) {
  return posts ? posts.map((post: any) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false } : { post: any, admin: any }) {

  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="flex flex-col gap-4 p-6 mb-4 bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Link href={`/${post.username}`} className="text-sm font-medium hover:underline">
          @{post.username}
        </Link>
      </div>

      <Link href={`/${post.username}/${post.slug}`} className="group">
        <h2 className="text-2xl font-bold group-hover:underline">
          {post.title}
        </h2>
      </Link>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {wordCount} words · {minutesToRead} min read
        </span>
        <span className="flex items-center gap-1">
          <span>💗</span> {post.heartCount || 0}
        </span>
      </div>

      {admin && (
        <div className="flex items-center justify-between mt-2 pt-4 border-t">
          <Link href={`/admin/${post.slug}`}>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Edit
            </button>
          </Link>

          <span className={post.published ? "text-green-500" : "text-red-500"}>
            {post.published ? "Live" : "Unpublished"}
          </span>
        </div>
      )}
    </div>
  );
}