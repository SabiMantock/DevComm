"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { searchIndex, type SearchEntry } from "@/lib/searchIndex";

const MAX_RESULTS = 8;
const CATEGORY_ORDER: SearchEntry["category"][] = ["Post", "Project", "Page"];

const matchesQuery = (entry: SearchEntry, needle: string) => {
    if (entry.title.toLowerCase().includes(needle)) return true;
    return entry.keywords?.some((keyword) => keyword.toLowerCase().includes(needle)) ?? false;
};

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const needle = query.trim().toLowerCase();
    const isOpen = isFocused && needle.length > 0;

    const results = isOpen ? searchIndex.filter((entry) => matchesQuery(entry, needle)).slice(0, MAX_RESULTS) : [];

    const groupedResults = CATEGORY_ORDER.map((category) => ({
        category,
        entries: results.filter((entry) => entry.category === category),
    })).filter((group) => group.entries.length > 0);

    const closeDropdown = () => {
        setIsFocused(false);
        inputRef.current?.blur();
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) closeDropdown();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeDropdown();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = () => {
        setQuery("");
        closeDropdown();
    };

    return (
        <div ref={containerRef} className="search-bar relative w-64">
            <form onSubmit={(event) => event.preventDefault()}>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search..."
                    aria-label="Search DevComm"
                    className="border-dark-200 bg-dark-100 placeholder:text-light-200 focus:border-primary/40 w-full rounded-[6px] border px-3 py-1.5 text-sm outline-none transition-colors"
                />
            </form>

            {isOpen && groupedResults.length > 0 && (
                <Card className="absolute top-full left-0 z-50 mt-2 max-h-80 gap-3 overflow-y-auto py-3">
                    {groupedResults.map((group) => (
                        <div key={group.category} className="flex flex-col gap-1">
                            <span className="text-light-200 px-2 text-xs font-semibold">{group.category}s</span>
                            <div className="flex flex-col">
                                {group.entries.map((entry) => (
                                    <Link
                                        key={`${entry.category}-${entry.id}`}
                                        href={entry.href}
                                        onClick={handleSelect}
                                        className="hover:text-primary rounded-[6px] px-2 py-1.5 text-sm transition-colors"
                                    >
                                        {entry.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </Card>
            )}
        </div>
    );
};

export default SearchBar;
