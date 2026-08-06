"use client";

type FilterGroup = {
    /** aria-label for the group; not rendered visually. */
    label: string;
    options: string[];
};

type FilterStripProps = {
    groups: FilterGroup[];
    className?: string;
};

const filterClassName = (isActive: boolean) =>
    isActive
        ? "text-primary text-sm font-semibold underline underline-offset-4"
        : "text-light-200 text-sm font-normal";

const FilterStrip = ({ groups, className = "" }: FilterStripProps) => {
    return (
        <div className={`filter-strip flex flex-row flex-wrap items-center justify-between gap-6 ${className}`.trim()}>
            {groups.map((group) => (
                <div key={group.label} role="group" aria-label={group.label} className="flex flex-row items-center gap-6">
                    {group.options.map((option) => (
                        <span key={option} className={filterClassName(option === "All")}>
                            {option}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default FilterStrip
