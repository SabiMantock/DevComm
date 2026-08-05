import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-border-dark border-t">
            <div className="mx-auto container flex flex-col items-center justify-between gap-3 sm:flex-row sm:px-10 px-5 py-6">
                <p className="text-light-200 text-xs">DevComm 1 &mdash; open source</p>

                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                    <Link href="/code-of-conduct" className="text-light-200 hover:text-light-100 text-xs transition-colors">
                        Read the guild rules
                    </Link>
                    <Link href="/contact" className="text-light-200 hover:text-light-100 text-xs transition-colors">
                        Contact
                    </Link>
                    {/* On md+ these live in the sidebar's "Other" group, which is hidden on mobile */}
                    <Link href="/privacy-policy" className="text-light-200 hover:text-light-100 text-xs transition-colors md:hidden">
                        Privacy Policy
                    </Link>
                    <Link href="/terms-of-use" className="text-light-200 hover:text-light-100 text-xs transition-colors md:hidden">
                        Terms of Use
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-200 hover:text-light-100 text-xs transition-colors"
                    >
                        GitHub
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-200 hover:text-light-100 text-xs transition-colors md:hidden"
                    >
                        Twitter
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-200 hover:text-light-100 text-xs transition-colors md:hidden"
                    >
                        Discord
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
