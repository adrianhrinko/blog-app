import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar({ }) {

    const user: any = null;
    const username: any = null;

    return (
        <nav className="flex flex-row items-center px-4 py-2 border-b">
            <Link href="/">
                <div className="flex items-center justify-center">
                    <div className="font-mono text-2xl font-black bg-black text-white px-3 py-1 rounded">FEED</div>
                </div>
            </Link>

            <div className="flex flex-row ml-auto gap-4"> {/* ml-auto pushes items to the right */}
                {/* user is signed-in and has username */}
                {username && (
                <>
                    <Link href="/admin">
                        <Button>Write Posts</Button>
                    </Link>
                    <Link href={`/${username}`}>
                        <Avatar>
                            <AvatarImage src={user?.photoURL} alt={username} />
                            <AvatarFallback>
                                <img 
                                    src="/defaultAvatar.svg" 
                                    alt="Default Avatar"
                                    className="h-full w-full"
                                />
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <Link href="/enter">
                        <Button variant="default">Log in</Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}
