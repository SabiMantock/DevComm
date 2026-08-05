import FooterLink from "@/components/FooterLink";
import SocialLinks from "@/components/SocialLinks";

const Footer = () => {
    return (
        <footer className="border-border-dark border-t">
            <div className="mx-auto container flex flex-col items-center justify-between gap-3 sm:flex-row sm:px-10 px-5 py-6">
                <p className="text-light-200 text-xs">DevComm 1 &mdash; open source</p>

                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                    <FooterLink href="/code-of-conduct" label="Read the guild rules" />
                    <FooterLink href="/contact" label="Contact" />
                    {/* On md+ these live in the sidebar's "Other" group, which is hidden on mobile */}
                    <FooterLink href="/privacy-policy" label="Privacy Policy" mobileOnly />
                    <FooterLink href="/terms-of-use" label="Terms of Use" mobileOnly />
                    <SocialLinks />
                </div>
            </div>
        </footer>
    )
}

export default Footer
