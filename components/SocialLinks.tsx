import Link from "next/link";

const socials = [
    { label: "GitHub", href: "/" },
    { label: "Twitter", href: "/" },
    { label: "Discord", href: "/" },
];

const SocialLinks = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex flex-row items-center gap-3 ${className}`.trim()}>
            {socials.map(({ label, href }) => (
                <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light-200 hover:text-light-100 text-xs transition-colors"
                >
                    {label}
                </Link>
            ))}
        </div>
    )
}

export default SocialLinks
