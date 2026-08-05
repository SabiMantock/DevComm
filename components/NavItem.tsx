import Link from "next/link";

interface NavItemProps {
    href: string;
    label: string;
    /** Marks this item as the current page. Wire up via `usePathname()` once real routes exist. */
    isActive?: boolean;
    /** Secondary items (e.g. the "Other" group) render smaller and lighter. */
    variant?: "primary" | "secondary";
}

const NavItem = ({ href, label, isActive = false, variant = "primary" }: NavItemProps) => {
    const sizeClasses = variant === "secondary" ? "text-[13px] font-normal" : "text-sm font-medium";
    const colorClasses = isActive
        ? "text-primary font-semibold bg-dark-100"
        : variant === "secondary"
            ? "text-light-200"
            : "text-light-100";

    return (
        <li>
            <Link
                href={href}
                className={`flex flex-row items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-dark-100 ${sizeClasses} ${colorClasses}`}
            >
                {label}
            </Link>
        </li>
    )
}

export default NavItem
