"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import ArticleInteractions, { type ArticleInteractionsHandle, type Comment } from "@/components/ArticleInteractions";
import Button from "@/components/Button";
import MoreFromAuthor from "@/components/MoreFromAuthor";
import type { Post } from "@/data/posts";
import type { Project } from "@/data/projects";
import { formatRelativeTime } from "@/lib/formatTime";
import { useBookmarks } from "@/lib/bookmarks-context";

type PostArticleProps = {
    post: Post;
    relatedProject?: Project;
    initialComments: Comment[];
    moreFromAuthor: Post[];
};

/** Post detail body: sticky reaction rail (like/comments/bookmark) + article content + "more from author" sidebar. Mirrors ArticleInteractions' internal like/comment state via onReactionChange/ref instead of keeping a second copy. */
const PostArticle = ({ post, relatedProject, initialComments, moreFromAuthor }: PostArticleProps) => {
    const { isSaved, toggleSave } = useBookmarks();
    const saved = isSaved(post.id);

    const articleRef = useRef<ArticleInteractionsHandle>(null);
    const initialLikes = post.replies + 8;
    const [reaction, setReaction] = useState({ likes: initialLikes, liked: false, commentCount: initialComments.length });

    const paragraphs = post.body.split("\n\n");

    return (
        <div className="flex flex-row items-start gap-6">
            <div className="sticky top-6 flex shrink-0 flex-col items-center gap-6 pt-1">
                <button
                    type="button"
                    onClick={() => articleRef.current?.toggleLike()}
                    aria-pressed={reaction.liked}
                    className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${reaction.liked ? "text-primary" : "text-light-200 hover:text-light-100"}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={reaction.liked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s-6.72-4.35-9.33-8.2C1 10 1.6 6.6 4.4 5.1c2.3-1.2 4.9-.4 6.2 1.6l1.4 2.1 1.4-2.1c1.3-2 3.9-2.8 6.2-1.6 2.8 1.5 3.4 4.9 1.7 7.7C18.72 16.65 12 21 12 21z"
                        />
                    </svg>
                    {reaction.likes}
                </button>

                <Link
                    href="#comments"
                    className="text-light-200 hover:text-light-100 flex flex-col items-center gap-1 text-xs font-semibold transition-colors"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                        />
                    </svg>
                    {reaction.commentCount}
                </Link>

                <button
                    type="button"
                    onClick={() => toggleSave(post.id)}
                    aria-pressed={saved}
                    aria-label={saved ? "Remove bookmark" : "Save post"}
                    className={`transition-colors ${saved ? "text-primary" : "text-light-200 hover:text-light-100"}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={saved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                </button>
            </div>

            <article className="flex flex-1 flex-col gap-6">
                {post.coverImage && <div className="bg-dark-200 aspect-[21/9] w-full rounded-[10px]" aria-hidden="true" />}

                <div className="flex flex-row flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-row items-center gap-3">
                        <div className="bg-dark-200 h-10 w-10 shrink-0 rounded-full" aria-hidden="true" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{post.author}</span>
                            <span className="text-light-200 text-xs">{formatRelativeTime(post.publishedAt)}</span>
                        </div>
                    </div>

                    {relatedProject && (
                        <Button href={`/playground/${relatedProject.id}`} variant="ghost">
                            View the project
                        </Button>
                    )}
                </div>

                <h1>{post.title}</h1>

                <div className="flex flex-row flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="pill">
                            #{tag.toLowerCase().replace(/[^a-z0-9]/g, "")}
                        </span>
                    ))}
                </div>

                <ArticleInteractions
                    ref={articleRef}
                    initialLikes={initialLikes}
                    initialComments={initialComments}
                    hideReactionBar
                    onReactionChange={setReaction}
                >
                    <div className="flex flex-col gap-4">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-light-100 text-sm leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </ArticleInteractions>
            </article>

            {moreFromAuthor.length > 0 && (
                <aside className="hidden w-72 shrink-0 flex-col gap-6 lg:flex">
                    <MoreFromAuthor author={post.author} posts={moreFromAuthor} />
                </aside>
            )}
        </div>
    );
};

export default PostArticle;
