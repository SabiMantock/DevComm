import NavItem from "@/components/NavItem";
import SocialLinks from "@/components/SocialLinks";

const Sidebar = () => {
    return (
        <nav aria-label="Sidebar navigation" className="border-border-dark flex w-full flex-col gap-6 border-b pb-3 pt-4 md:w-56 md:border-b-0 md:py-4">
            <div className="flex flex-col">
                <ul className="m-0 flex list-none flex-row gap-1 overflow-x-auto p-0 md:flex-col md:gap-3">
                    <NavItem href="/" label="Home" />
                    <NavItem href="/playground" label="Playground" />
                    <NavItem href="/bookmarks" label="Saved List" />
                    <NavItem href="/about" label="About" />
                    <NavItem href="/contact" label="Contact" />
                </ul>
            </div>

            <div className="border-border-dark hidden flex-col border-t pt-4 md:flex">
                <p className="text-light-200 mb-2 text-xs tracking-wide">Other</p>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    <NavItem href="/code-of-conduct" label="Code of Conduct" variant="secondary" />
                    <NavItem href="/privacy-policy" label="Privacy Policy" variant="secondary" />
                    <NavItem href="/terms-of-use" label="Terms of Use" variant="secondary" />
                </ul>
            </div>

            <div className="border-border-dark hidden border-t pt-4 md:flex">
                <SocialLinks />
            </div>
        </nav>
    )
}

export default Sidebar
