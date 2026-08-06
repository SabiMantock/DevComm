import Card from "@/components/Card";
import type { Post } from "@/data/posts";

type PostCardProps = Post;

const PostCard = ({ author, timestamp, title, tags, replies }: PostCardProps) => {
    return (
        <Card as="article" className="post-card">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                    <div className="bg-dark-200 h-10 w-10 shrink-0 rounded-full" aria-hidden="true" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{author}</span>
                        <span className="text-light-200 text-xs">{timestamp}</span>
                    </div>
                </div>
                <span className="text-light-200 text-sm">
                    {replies} {replies === 1 ? "reply" : "replies"}
                </span>
            </div>

            <h3 className="text-lg font-semibold">{title}</h3>

            <div className="flex flex-row flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag} className="pill">
                        #{tag.toLowerCase().replace(/[^a-z0-9]/g, "")}
                    </span>
                ))}
            </div>
        </Card>
    )
}

export default PostCard
