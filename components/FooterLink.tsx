import Link from "next/link";

interface FooterLinkProps {
    href: string;
    label: string;
    /** External links open in a new tab. */
    external?: boolean;
    /** Hidden on md+, where the link already lives in the sidebar. */
    mobileOnly?: boolean;
}

const FooterLink = ({ href, label, external = false, mobileOnly = false }: FooterLinkProps) => {
    return (
        <Link
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className={`text-light-200 hover:text-light-100 text-xs transition-colors${mobileOnly ? " md:hidden" : ""}`}
        >
            {label}
        </Link>
    )
}

export default FooterLink
