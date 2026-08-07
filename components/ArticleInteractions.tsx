"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import Button from "@/components/Button";

export type Reply = {
    id: string;
    author: string;
    timestamp: string;
    body: string;
    likes: number;
    liked: boolean;
};

export type Comment = {
    id: string;
    author: string;
    timestamp: string;
    body: string;
    likes: number;
    liked: boolean;
    replies: Reply[];
};

/** Imperative handle so a parent that hides the internal reaction bar (see hideReactionBar) can still trigger the like toggle — e.g. the post detail page's sidebar. */
export type ArticleInteractionsHandle = {
    toggleLike: () => void;
};

type ReactionState = {
    likes: number;
    liked: boolean;
    commentCount: number;
};

type ArticleInteractionsProps = {
    initialLikes: number;
    initialComments: Comment[];
    /** Secondary CTA rendered alongside the like/comment row (e.g. "Make a post about it" on project pages). */
    secondaryAction?: React.ReactNode;
    /** Body content rendered between the reaction bar and the Comments heading. */
    children: React.ReactNode;
    /** Hides the internal like-button/comment-count row — for a parent rendering its own reaction UI elsewhere (e.g. the post detail page's sidebar). Defaults to false, so existing usages are unaffected. */
    hideReactionBar?: boolean;
    /** Reports the live like/comment state whenever it changes, so a parent-rendered reaction UI can mirror this component's internal state instead of keeping a disconnected copy. */
    onReactionChange?: (state: ReactionState) => void;
};

/** Shared heart icon for the top-level like button, per-comment likes, and per-reply likes. */
const HeartIcon = ({ filled, className = "h-5 w-5" }: { filled: boolean; className?: string }) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-6.72-4.35-9.33-8.2C1 10 1.6 6.6 4.4 5.1c2.3-1.2 4.9-.4 6.2 1.6l1.4 2.1 1.4-2.1c1.3-2 3.9-2.8 6.2-1.6 2.8 1.5 3.4 4.9 1.7 7.7C18.72 16.65 12 21 12 21z"
        />
    </svg>
);

/** Like button + comment thread shared by the post and project detail pages. */
const ArticleInteractions = forwardRef<ArticleInteractionsHandle, ArticleInteractionsProps>(function ArticleInteractions(
    { initialLikes, initialComments, secondaryAction, children, hideReactionBar = false, onReactionChange },
    ref
) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [draft, setDraft] = useState("");
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyDraft, setReplyDraft] = useState("");

    const toggleLike = useCallback(() => {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikes((count) => (nextLiked ? count + 1 : count - 1));
    }, [liked]);

    useImperativeHandle(ref, () => ({ toggleLike }), [toggleLike]);

    useEffect(() => {
        onReactionChange?.({ likes, liked, commentCount: comments.length });
    }, [likes, liked, comments.length, onReactionChange]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const body = draft.trim();
        if (!body) return;

        setComments((prev) => [
            { id: crypto.randomUUID(), author: "You", timestamp: "Just now", body, likes: 0, liked: false, replies: [] },
            ...prev,
        ]);
        setDraft("");
    };

    /** Toggles like state on a top-level comment, or on one of its replies when replyId is given. */
    const toggleCommentLike = (commentId: string, replyId?: string) => {
        setComments((prev) =>
            prev.map((comment) => {
                if (comment.id !== commentId) return comment;

                if (replyId) {
                    return {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                            reply.id === replyId
                                ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                                : reply
                        ),
                    };
                }

                return { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 };
            })
        );
    };

    /** Appends a new reply (author "You") to the given top-level comment. */
    const addReply = (commentId: string, body: string) => {
        const trimmed = body.trim();
        if (!trimmed) return;

        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? {
                          ...comment,
                          replies: [
                              ...comment.replies,
                              { id: crypto.randomUUID(), author: "You", timestamp: "Just now", body: trimmed, likes: 0, liked: false },
                          ],
                      }
                    : comment
            )
        );
    };

    /** Opens the inline reply form for a comment, or closes it if it's already open. Only one open at a time. */
    const toggleReplyForm = (commentId: string) => {
        setReplyingToId((current) => (current === commentId ? null : commentId));
        setReplyDraft("");
    };

    const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>, commentId: string) => {
        event.preventDefault();
        const trimmed = replyDraft.trim();
        if (!trimmed) return;

        addReply(commentId, trimmed);
        setReplyDraft("");
        setReplyingToId(null);
    };

    return (
        <>
            {!hideReactionBar && (
                <div className="flex flex-row items-center gap-5">
                    <button
                        type="button"
                        onClick={toggleLike}
                        aria-pressed={liked}
                        className={`flex flex-row items-center gap-2 text-sm font-semibold transition-colors ${liked ? "text-primary" : "text-light-200 hover:text-light-100"}`}
                    >
                        <HeartIcon filled={liked} />
                        {likes}
                    </button>

                    <span className="text-light-200 text-sm">
                        {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </span>

                    {secondaryAction && <div className="ml-auto">{secondaryAction}</div>}
                </div>
            )}

            {children}

            <h3 id="comments">Comments</h3>

            <form onSubmit={handleSubmit} className="flex flex-row items-start gap-3">
                <div className="bg-dark-200 h-9 w-9 shrink-0 rounded-full" aria-hidden="true" />
                <div className="flex flex-1 flex-col items-start gap-3">
                    <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="bg-dark-100 border-dark-200 placeholder:text-light-200 w-full rounded-[6px] border px-4 py-3 text-sm"
                    />
                    <Button type="submit">Post comment</Button>
                </div>
            </form>

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {comments.map((comment) => (
                    <li key={comment.id} className="border-dark-200 flex flex-row items-start gap-3 border-t pt-4">
                        <div className="bg-dark-200 h-9 w-9 shrink-0 rounded-full" aria-hidden="true" />
                        <div className="flex flex-1 flex-col gap-1">
                            <div className="flex flex-row items-center gap-2">
                                <span className="text-sm font-semibold">{comment.author}</span>
                                <span className="text-light-200 text-xs">{comment.timestamp}</span>
                            </div>
                            <p className="text-light-100 text-sm leading-snug">{comment.body}</p>

                            <div className="flex flex-row items-center gap-4 pt-1">
                                <button
                                    type="button"
                                    onClick={() => toggleCommentLike(comment.id)}
                                    aria-pressed={comment.liked}
                                    className={`flex flex-row items-center gap-1.5 text-xs font-semibold transition-colors ${comment.liked ? "text-primary" : "text-light-200 hover:text-light-100"}`}
                                >
                                    <HeartIcon filled={comment.liked} className="h-4 w-4" />
                                    {comment.likes}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleReplyForm(comment.id)}
                                    className="text-light-200 hover:text-light-100 text-xs font-semibold transition-colors"
                                >
                                    Reply
                                </button>
                            </div>

                            {replyingToId === comment.id && (
                                <form
                                    onSubmit={(event) => handleReplySubmit(event, comment.id)}
                                    className="flex flex-row items-start gap-2.5 pt-2"
                                >
                                    <div className="bg-dark-200 h-8 w-8 shrink-0 rounded-full" aria-hidden="true" />
                                    <div className="flex flex-1 flex-col items-start gap-2">
                                        <textarea
                                            value={replyDraft}
                                            onChange={(event) => setReplyDraft(event.target.value)}
                                            placeholder="Write a reply..."
                                            rows={2}
                                            className="bg-dark-100 border-dark-200 placeholder:text-light-200 w-full rounded-[6px] border px-3 py-2 text-sm"
                                        />
                                        <Button type="submit">Reply</Button>
                                    </div>
                                </form>
                            )}

                            {comment.replies.length > 0 && (
                                <ul className="m-0 mt-2 ml-10 flex list-none flex-col gap-3 p-0">
                                    {comment.replies.map((reply) => (
                                        <li key={reply.id} className="flex flex-row items-start gap-2.5">
                                            <div className="bg-dark-200 h-7 w-7 shrink-0 rounded-full" aria-hidden="true" />
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-row items-center gap-2">
                                                    <span className="text-xs font-semibold">{reply.author}</span>
                                                    <span className="text-light-200 text-xs">{reply.timestamp}</span>
                                                </div>
                                                <p className="text-light-100 text-xs leading-snug">{reply.body}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCommentLike(comment.id, reply.id)}
                                                    aria-pressed={reply.liked}
                                                    className={`flex w-fit flex-row items-center gap-1.5 text-xs font-semibold transition-colors ${reply.liked ? "text-primary" : "text-light-200 hover:text-light-100"}`}
                                                >
                                                    <HeartIcon filled={reply.liked} className="h-3.5 w-3.5" />
                                                    {reply.likes}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
});

export default ArticleInteractions
