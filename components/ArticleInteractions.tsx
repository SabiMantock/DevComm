"use client";

import { useState } from "react";
import Button from "@/components/Button";

type Comment = {
    id: string;
    author: string;
    timestamp: string;
    body: string;
};

type ArticleInteractionsProps = {
    initialLikes: number;
    initialComments: Comment[];
    /** Secondary CTA rendered alongside the like/comment row (e.g. "Make a post about it" on project pages). */
    secondaryAction?: React.ReactNode;
    /** Body content rendered between the reaction bar and the Comments heading. */
    children: React.ReactNode;
};

/** Like button + comment thread shared by the post and project detail pages. */
const ArticleInteractions = ({ initialLikes, initialComments, secondaryAction, children }: ArticleInteractionsProps) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [draft, setDraft] = useState("");

    const toggleLike = () => {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikes((count) => (nextLiked ? count + 1 : count - 1));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const body = draft.trim();
        if (!body) return;

        setComments((prev) => [{ id: crypto.randomUUID(), author: "You", timestamp: "Just now", body }, ...prev]);
        setDraft("");
    };

    return (
        <>
            <div className="flex flex-row items-center gap-5">
                <button
                    type="button"
                    onClick={toggleLike}
                    aria-pressed={liked}
                    className={`flex flex-row items-center gap-2 text-sm font-semibold transition-colors ${liked ? "text-primary" : "text-light-200 hover:text-light-100"}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={liked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-5 w-5"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s-6.72-4.35-9.33-8.2C1 10 1.6 6.6 4.4 5.1c2.3-1.2 4.9-.4 6.2 1.6l1.4 2.1 1.4-2.1c1.3-2 3.9-2.8 6.2-1.6 2.8 1.5 3.4 4.9 1.7 7.7C18.72 16.65 12 21 12 21z"
                        />
                    </svg>
                    {likes}
                </button>

                <span className="text-light-200 text-sm">
                    {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </span>

                {secondaryAction && <div className="ml-auto">{secondaryAction}</div>}
            </div>

            {children}

            <h3>Comments</h3>

            <form onSubmit={handleSubmit} className="flex flex-col items-start gap-3">
                <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="bg-dark-100 border-dark-200 placeholder:text-light-200 w-full rounded-[6px] border px-4 py-3 text-sm"
                />
                <Button type="submit">Post comment</Button>
            </form>

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {comments.map((comment) => (
                    <li key={comment.id} className="border-dark-200 flex flex-col gap-1 border-t pt-4">
                        <div className="flex flex-row items-center gap-2">
                            <span className="text-sm font-semibold">{comment.author}</span>
                            <span className="text-light-200 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-light-100 text-sm leading-snug">{comment.body}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default ArticleInteractions
