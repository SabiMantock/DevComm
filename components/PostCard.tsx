"use client";

import Link from "next/link";
import Card from "@/components/Card";
import type { Post } from "@/data/posts";
import { formatReadTime, formatRelativeTime } from "@/lib/formatTime";
import { useBookmarks } from "@/lib/bookmarks-context";

type PostCardProps = Post;

const formatAbsoluteDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const PostCard = ({ id, author, publishedAt, title, tags, replies, likes, body }: PostCardProps) => {
    const { isSaved, toggleSave } = useBookmarks();
    const saved = isSaved(id);

    return (
        <Card as="article" className="post-card border-dark-200 hover:border-primary/40 relative transition-colors">
            <Link href={`/post/${id}`} className="absolute inset-0" aria-label={title} />

            <div className="flex flex-row items-center gap-3">
                <div className="bg-dark-200 h-10 w-10 shrink-0 rounded-full" aria-hidden="true" />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{author}</span>
                    <div className="flex flex-row items-center gap-1.5">
                        <span className="text-light-200 text-xs">{formatRelativeTime(publishedAt)}</span>
                        <span className="text-light-200 text-xs">· {formatAbsoluteDate(publishedAt)}</span>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-semibold">{title}</h3>

            <div className="relative z-10 flex flex-row flex-wrap gap-2">
                {tags.map((tag) => {
                    const slug = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
                    return (
                        <Link
                            key={tag}
                            href={`/tag/${slug}`}
                            className="pill hover:bg-dark-200 hover:text-primary transition-colors"
                        >
                            #{slug}
                        </Link>
                    );
                })}
            </div>

            <div className="flex flex-row items-center justify-between gap-4">
                <div className="text-light-200 flex flex-row items-center gap-4 text-sm">
                    <span className="hover:text-light-100 relative z-10 flex flex-row items-center gap-1.5 transition-colors">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 21s-6.72-4.35-9.33-8.2C1 10 1.6 6.6 4.4 5.1c2.3-1.2 4.9-.4 6.2 1.6l1.4 2.1 1.4-2.1c1.3-2 3.9-2.8 6.2-1.6 2.8 1.5 3.4 4.9 1.7 7.7C18.72 16.65 12 21 12 21z"
                            />
                        </svg>
                        {likes}
                    </span>
                    <Link
                        href={`/post/${id}#comments`}
                        className="hover:text-light-100 relative z-10 flex flex-row items-center gap-1.5 transition-colors"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                            />
                        </svg>
                        {replies}
                    </Link>
                    <span>{formatReadTime(body)}</span>
                </div>

                <button
                    type="button"
                    onClick={() => toggleSave(id)}
                    aria-pressed={saved}
                    aria-label={saved ? "Remove bookmark" : "Save post"}
                    className={`relative z-10 -m-1.5 flex flex-row items-center rounded-full p-1.5 transition-colors ${saved ? "text-primary hover:bg-primary/10" : "text-light-200 hover:bg-dark-200 hover:text-light-100"}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={saved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                </button>
            </div>
        </Card>
    )
}

export default PostCard
