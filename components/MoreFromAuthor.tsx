import Link from "next/link";
import type { Post } from "@/data/posts";

type MoreFromAuthorProps = {
    author: string;
    posts: Post[];
};

/** Sidebar list of the same author's other posts, shown on the post detail page. Renders nothing if there are none. */
const MoreFromAuthor = ({ author, posts }: MoreFromAuthorProps) => {
    if (posts.length === 0) return null;

    return (
        <div className="more-from-author flex w-full flex-col gap-4">
            <span className="text-sm font-semibold">More from {author}</span>

            <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {posts.map((post) => (
                    <li key={post.id} className="flex flex-col gap-1.5">
                        <Link
                            href={`/post/${post.id}`}
                            className="text-light-100 hover:text-primary text-sm leading-snug transition-colors"
                        >
                            {post.title}
                        </Link>
                        <div className="flex flex-row flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="pill">
                                    #{tag.toLowerCase().replace(/[^a-z0-9]/g, "")}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MoreFromAuthor;
