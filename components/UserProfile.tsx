import AvatarComponent from "./Avatar";

// UI component for user profile
export default function UserProfile({ user }: { user: any }) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AvatarComponent user={user} username={user.username} className="h-28 w-28" />
        <p className="mt-2">
          <i>@{user.username}</i>
        </p>
        <h1 className="text-2xl font-bold">{user.displayName || 'Anonymous User'}</h1>
      </div>
    );
  }