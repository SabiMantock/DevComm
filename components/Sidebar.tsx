import Link from "next/link";
import NavItem from "@/components/NavItem";

const Sidebar = () => {
    return (
        <nav aria-label="Sidebar navigation" className="flex w-56 flex-col gap-6 py-4">
            <div className="flex flex-col">
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    <NavItem href="/" label="Home" />
                    <NavItem href="/playground" label="Playground" />
                    <NavItem href="/about" label="About" />
                    <NavItem href="/contact" label="Contact" />
                </ul>
            </div>

            <div className="border-border-dark flex flex-col border-t pt-4">
                <p className="text-light-200 mb-2 text-xs tracking-wide">Other</p>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    <NavItem href="/code-of-conduct" label="Code of Conduct" variant="secondary" />
                    <NavItem href="/privacy-policy" label="Privacy Policy" variant="secondary" />
                    <NavItem href="/terms-of-use" label="Terms of Use" variant="secondary" />
                </ul>
            </div>

            <div className="border-border-dark flex flex-row items-center gap-3 border-t pt-4">
                <Link href="/" className="text-light-200 hover:text-light-100 text-xs transition-colors">
                    GitHub
                </Link>
                <Link href="/" className="text-light-200 hover:text-light-100 text-xs transition-colors">
                    Twitter
                </Link>
                <Link href="/" className="text-light-200 hover:text-light-100 text-xs transition-colors">
                    Discord
                </Link>
            </div>
        </nav>
    )
}

export default Sidebar
