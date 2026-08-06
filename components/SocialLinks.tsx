import FooterLink from "@/components/FooterLink";

const socials = [
    { label: "GitHub", href: "/" },
    { label: "Twitter", href: "/" },
    { label: "Discord", href: "/" },
];

const SocialLinks = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex flex-row items-center gap-3 ${className}`.trim()}>
            {socials.map(({ label, href }) => (
                <FooterLink key={label} href={href} label={label} external />
            ))}
        </div>
    )
}

export default SocialLinks
