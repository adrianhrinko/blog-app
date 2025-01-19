import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { User } from "firebase/auth";
import { cn } from "@/lib/utils";


export default function AvatarComponent({ photoUrl, username, className }: { photoUrl?: string, username: string, className?: string }) {
  return (
        <Avatar className={className}>
            <AvatarImage 
              src={photoUrl} 
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