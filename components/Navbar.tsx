import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import AuthButtons from "@/components/AuthButtons";

const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="flex flex-row items-center gap-6">
                    <Logo />
                    <SearchBar />
                </div>
                <AuthButtons />
            </nav>
        </header>
    )
}

export default Navbar
