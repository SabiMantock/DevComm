type CardProps = {
    children: React.ReactNode;
    className?: string;
    /** article for standalone content (e.g. a post), div otherwise. */
    as?: "div" | "article";
};

const Card = ({ children, className = "", as = "div" }: CardProps) => {
    const Tag = as;

    return (
        <Tag className={`bg-dark-100 border-dark-200 flex w-full flex-col gap-4 rounded-[10px] border px-5 py-6 ${className}`.trim()}>
            {children}
        </Tag>
    )
}

export default Card
