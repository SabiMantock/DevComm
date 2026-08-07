import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import AuthButtons from "@/components/AuthButtons";

const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="flex min-w-0 flex-1 flex-row items-center gap-6">
                    <Logo />
                    <SearchBar />
                </div>
                <AuthButtons />
            </nav>
        </header>
    )
}

export default Navbar
