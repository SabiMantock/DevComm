"use client";

type FilterGroup = {
    /** aria-label for the group; not rendered visually. */
    label: string;
    options: string[];
};

type FilterStripProps = {
    groups: FilterGroup[];
    /** group.label -> selected option. Callers not yet wired up to state can omit this. */
    value?: Record<string, string>;
    onChange?: (groupLabel: string, option: string) => void;
    className?: string;
};

const filterClassName = (isActive: boolean) =>
    isActive
        ? "text-primary text-sm font-semibold underline underline-offset-4"
        : "text-light-200 text-sm font-normal";

const FilterStrip = ({ groups, value = {}, onChange, className = "" }: FilterStripProps) => {
    return (
        <div className={`filter-strip flex flex-row flex-wrap items-center justify-between gap-6 ${className}`.trim()}>
            {groups.map((group) => (
                <div key={group.label} role="group" aria-label={group.label} className="flex flex-row items-center gap-6">
                    {group.options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange?.(group.label, option)}
                            className={filterClassName(option === value[group.label])}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default FilterStrip
