import Link from "next/link";

interface ButtonProps {
    children: React.ReactNode;
    /** Renders as a Link when set, otherwise as a static button. */
    href?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    /** primary: filled CTA style. ghost: outlined, for secondary actions. */
    variant?: "primary" | "ghost";
    /** No-op when `href` is set — a Link can't be meaningfully disabled. */
    disabled?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-primary hover:bg-primary/90 text-black",
    ghost: "border-dark-200 text-light-100 hover:bg-dark-100 border",
};

const Button = ({ children, href, className = "", type = "button", onClick, variant = "primary", disabled = false }: ButtonProps) => {
    const classes =
        `flex cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>
            {children}
        </button>
    );
};

export default Button;
