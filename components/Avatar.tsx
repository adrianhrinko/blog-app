import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "firebase/auth";

export default function AvatarComponent({ user, username, className }: { user: User, username: string, className?: string }) {
  return (
    <Avatar className={className}>
        <AvatarImage src={user?.photoURL ?? undefined} alt={username} className="h-full w-full" />
        <AvatarFallback>
            <img 
                src="/defaultAvatar.svg" 
                alt="Default Avatar" 
                className="h-full w-full"
            />
        </AvatarFallback>
    </Avatar>
  )
}