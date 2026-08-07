"use client";

import { useState } from "react";
import Link from "next/link";
import { posts as allPosts } from "@/data/posts";
import { formatReadTime, formatRelativeTime } from "@/lib/formatTime";
import { useBookmarks } from "@/lib/bookmarks-context";

type SavedPostsListProps = {
    mode: "bookmarks" | "archive";
};

const ALL_TAGS = "All tags";

const slugify = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]/g, "");

const formatAbsoluteDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Shared body for /bookmarks and /archive — resolves the mode's ids from useBookmarks() against data/posts.ts, then filters by tag + title search client-side. */
const SavedPostsList = ({ mode }: SavedPostsListProps) => {
    const { savedIds, archivedIds, archive, unarchive } = useBookmarks();
    const [activeTag, setActiveTag] = useState(ALL_TAGS);
    const [search, setSearch] = useState("");

    const ids = mode === "bookmarks" ? savedIds : archivedIds;
    const savedPosts = allPosts.filter((post) => ids.has(post.id));

    const tags = Array.from(new Set(savedPosts.flatMap((post) => post.tags.map(slugify))));

    const tagFiltered =
        activeTag === ALL_TAGS ? savedPosts : savedPosts.filter((post) => post.tags.some((tag) => slugify(tag) === activeTag));

    const needle = search.trim().toLowerCase();
    const visiblePosts = needle ? tagFiltered.filter((post) => post.title.toLowerCase().includes(needle)) : tagFiltered;

    const heading = mode === "bookmarks" ? `Saved List (${savedPosts.length})` : `Archive (${savedPosts.length})`;
    const toggleHref = mode === "bookmarks" ? "/archive" : "/bookmarks";
    const toggleLabel = mode === "bookmarks" ? "View archive" : "View saved";
    const actionLabel = mode === "bookmarks" ? "Archive" : "Unarchive";
    const emptyMessage = mode === "bookmarks" ? "Your bookmarks are empty..." : "Your archive is empty...";

    return (
        <div className="flex flex-row items-start gap-8">
            {tags.length > 0 && (
                <aside className="hidden w-48 shrink-0 flex-col gap-3 lg:flex">
                    <button
                        type="button"
                        onClick={() => setActiveTag(ALL_TAGS)}
                        className={`text-left text-sm transition-colors ${activeTag === ALL_TAGS ? "text-primary font-semibold" : "text-light-200 hover:text-light-100"}`}
                    >
                        {ALL_TAGS}
                    </button>
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(tag)}
                            className={`text-left text-sm transition-colors ${activeTag === tag ? "text-primary font-semibold" : "text-light-200 hover:text-light-100"}`}
                        >
                            #{tag}
                        </button>
                    ))}
                </aside>
            )}

            <section className="flex flex-1 flex-col gap-6">
                <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <h1>{heading}</h1>
                    <div className="flex flex-row items-center gap-4">
                        <Link href={toggleHref} className="text-light-200 hover:text-light-100 text-sm font-semibold transition-colors">
                            {toggleLabel}
                        </Link>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search titles..."
                            aria-label={`Search ${mode}`}
                            className="border-dark-200 bg-dark-100 placeholder:text-light-200 focus:border-primary/40 w-48 rounded-[6px] border px-3 py-1.5 text-sm outline-none transition-colors"
                        />
                    </div>
                </div>

                {visiblePosts.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {visiblePosts.map((post) => (
                            <div key={post.id} className="border-dark-200 flex flex-row items-start gap-3 border-b pb-4">
                                <div className="bg-dark-200 h-10 w-10 shrink-0 rounded-full" aria-hidden="true" />
                                <div className="flex flex-1 flex-col gap-1">
                                    <Link
                                        href={`/post/${post.id}`}
                                        className="hover:text-primary text-sm font-semibold transition-colors"
                                    >
                                        {post.title}
                                    </Link>
                                    <span className="text-light-200 text-xs">
                                        {post.author} · {formatRelativeTime(post.publishedAt)} · {formatAbsoluteDate(post.publishedAt)} ·{" "}
                                        {formatReadTime(post.body)}
                                    </span>
                                    <div className="flex flex-row flex-wrap gap-2 pt-1">
                                        {post.tags.map((tag) => (
                                            <Link
                                                key={tag}
                                                href={`/tag/${slugify(tag)}`}
                                                className="pill hover:bg-dark-200 hover:text-primary transition-colors"
                                            >
                                                #{slugify(tag)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => (mode === "bookmarks" ? archive(post.id) : unarchive(post.id))}
                                    className="text-light-200 hover:text-primary shrink-0 text-xs font-semibold transition-colors"
                                >
                                    {actionLabel}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-light-200 py-12 text-center text-sm">{emptyMessage}</p>
                )}
            </section>
        </div>
    );
};

export default SavedPostsList;
