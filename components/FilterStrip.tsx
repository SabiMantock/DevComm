"use client";

const filters = ["All", "Questions", "Tips", "Memes", "Wins"];

const FilterStrip = () => {
    return (
        <nav aria-label="Filter posts by type" className="filter-strip mt-6 flex flex-row items-center gap-6">
            {filters.map((filter) => (
                <span
                    key={filter}
                    className={
                        filter === "All"
                            ? "text-primary text-sm font-semibold underline underline-offset-4"
                            : "text-light-200 text-sm font-normal"
                    }
                >
                    {filter}
                </span>
            ))}
        </nav>
    )
}

export default FilterStrip
