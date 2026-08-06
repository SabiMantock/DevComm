"use client";

const typeFilters = ["All", "Web app", "Tool", "Game", "Script"];
const statusFilters = ["All", "WIP", "Shipped"];

const filterClassName = (isActive: boolean) =>
    isActive
        ? "text-primary text-sm font-semibold underline underline-offset-4"
        : "text-light-200 text-sm font-normal";

const PlaygroundFilterStrip = () => {
    return (
        <div className="playground-filter-strip flex flex-row flex-wrap items-center justify-between gap-6">
            <div role="group" aria-label="Filter by type" className="flex flex-row items-center gap-6">
                {typeFilters.map((filter) => (
                    <span key={filter} className={filterClassName(filter === "All")}>
                        {filter}
                    </span>
                ))}
            </div>

            <div role="group" aria-label="Filter by status" className="flex flex-row items-center gap-6">
                {statusFilters.map((filter) => (
                    <span key={filter} className={filterClassName(filter === "All")}>
                        {filter}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default PlaygroundFilterStrip
