import Link from "next/link"
import NavbarActions from "./NavbarActions"
export default function Navbar({ }) {

    return (
        <nav className="flex flex-row items-center px-4 py-2 border-b">
            <Link href="/">
                <div className="flex items-center justify-center">
                    <div className="font-mono text-2xl font-black bg-black text-white px-3 py-1 rounded">FEED</div>
                </div>
            </Link>
            <NavbarActions />
        </nav>
    )
}
