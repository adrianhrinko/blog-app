"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/providers/AuthContextProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutUser } from "@/lib/firebase";

export default function Page({ }) {
    const { user, username } = useAuth();

  return (
    <div className="flex flex-row ml-auto gap-4"> {/* ml-auto pushes items to the right */}
        {/* user is signed-in and has username */}
        {username && (
        <>
            <Link href="/admin">
                <Button>Write Posts</Button>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.photoURL ?? undefined} alt={username} />
                        <AvatarFallback>
                            <img 
                                src="/defaultAvatar.svg" 
                                alt="Default Avatar" 
                                className="h-full w-full"
                            />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/${username}`}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOutUser()}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
            <Link href="/signin">
                <Button variant="default">Sign in</Button>
            </Link>
        )}
    </div>
  )
}