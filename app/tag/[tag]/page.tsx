import PostCard from "@/components/PostCard";
import { posts } from "@/data/posts";

const slugify = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]/g, "");

const Page = async (props: PageProps<"/tag/[tag]">) => {
  const { tag } = await props.params;
  const matchingPosts = posts.filter((post) => post.tags.some((postTag) => slugify(postTag) === tag));

  if (matchingPosts.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-center">No posts found for #{tag}</h1>
        <p className="text-light-100 text-center text-sm">Try browsing from the home page instead.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <h1>#{tag}</h1>
      <div className="post-list flex flex-col gap-4">
        {matchingPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </section>
  );
};

export default Page;
