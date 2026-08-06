import Link from "next/link";

interface CTAButtonProps {
    children: React.ReactNode;
    /** Renders as a Link when set, otherwise as a static button. */
    href?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

const CTAButton = ({ children, href, className = "", type = "button", onClick }: CTAButtonProps) => {
    const classes = `bg-primary hover:bg-primary/90 flex cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-sm font-semibold text-black transition-colors ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={classes}>
            {children}
        </button>
    );
};

export default CTAButton;
