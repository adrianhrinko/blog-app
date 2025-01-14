"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/providers/AuthContextProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutUser } from "@/lib/firebase";
import { LogOutIcon, PencilIcon, UserIcon } from "lucide-react";
import AvatarComponent from "../Avatar";

export default function Page({ }) {
    const { user, username } = useAuth();

  return (
    <div className="flex flex-row ml-auto gap-4"> {/* ml-auto pushes items to the right */}
        {/* user is signed-in and has username */}
        {user && username && (
        <>
            <Link href="/admin">
                <Button>
                    <PencilIcon />
                    Write Posts
                </Button>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <AvatarComponent user={user} username={username} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>@{username}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/${username}`} className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOutUser()} className="flex items-center gap-2">
                        <LogOutIcon className="h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
            <Link href="/auth/signin">
                <Button variant="default">Sign in</Button>
            </Link>
        )}
    </div>
  )
}