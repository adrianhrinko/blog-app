import Link from "next/link"
import NavbarActions from "./NavbarActions"
import Logo from "../Logo"
export default function Navbar({ }) {

    return (
        <nav className="flex flex-row items-center px-4 py-2 border-b">
            <Link href="/">
                <Logo />
            </Link>
            <NavbarActions />
        </nav>
    )
}
