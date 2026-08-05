import FooterLink from "@/components/FooterLink";

const Footer = () => {
    return (
        <footer className="border-border-dark border-t">
            <div className="mx-auto container flex flex-col items-center justify-between gap-3 sm:flex-row sm:px-10 px-5 py-6">
                <p className="text-light-200 text-xs">DevComm 1 &mdash; open source</p>

                <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    <FooterLink href="/code-of-conduct" label="Read the guild rules" />
                    <FooterLink href="/contact" label="Contact" />
                    {/* On md+ these live in the sidebar's "Other" group, which is hidden on mobile */}
                    <FooterLink href="/privacy-policy" label="Privacy Policy" mobileOnly />
                    <FooterLink href="/terms-of-use" label="Terms of Use" mobileOnly />
                    <FooterLink href="/" label="GitHub" external />
                    <FooterLink href="/" label="Twitter" external mobileOnly />
                    <FooterLink href="/" label="Discord" external mobileOnly />
                </div>
            </div>
        </footer>
    )
}

export default Footer
