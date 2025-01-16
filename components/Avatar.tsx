import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { User } from "firebase/auth";
import { cn } from "@/lib/utils";


export default function AvatarComponent({ user, username, className }: { user?: User, username: string, className?: string }) {
  return (
        <Avatar className={className}>
            <AvatarImage 
              src={user?.photoURL ?? undefined} 
              alt={username}  
            />
            <AvatarFallback>
            <img 
                src="/defaultAvatar.svg" 
                alt="Default Avatar" 
            />
            </AvatarFallback>
        </Avatar>
  )
}