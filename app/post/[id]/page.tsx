import ArticleInteractions from "@/components/ArticleInteractions";
import Button from "@/components/Button";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";

const dummyComments = [
  {
    id: "c1",
    author: "Sam Rivera",
    timestamp: "1h ago",
    body: "This is exactly the kind of thing I needed to read today, thanks for writing it up.",
  },
  {
    id: "c2",
    author: "Devon Park",
    timestamp: "40m ago",
    body: "Solid take. Following this thread.",
  },
  {
    id: "c3",
    author: "Lena Ortiz",
    timestamp: "12m ago",
    body: "Had almost the exact same experience last week, good to know I'm not the only one.",
  },
];

const Page = async (props: PageProps<"/post/[id]">) => {
  const { id } = await props.params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-center">Post not found</h1>
        <p className="text-light-100 text-center text-sm">We couldn&apos;t find a post with that id.</p>
      </section>
    );
  }

  const paragraphs = post.body.split("\n\n");
  const relatedProject = post.projectId ? projects.find((p) => p.id === post.projectId) : undefined;

  return (
    <article className="flex flex-col gap-6">
      {post.coverImage && <div className="bg-dark-200 aspect-[21/9] w-full rounded-[10px]" aria-hidden="true" />}

      <div className="flex flex-row items-center gap-3">
        <div className="bg-dark-200 h-10 w-10 shrink-0 rounded-full" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{post.author}</span>
          <span className="text-light-200 text-xs">{post.timestamp}</span>
        </div>
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
        initialLikes={post.replies + 8}
        initialComments={dummyComments}
        secondaryAction={
          relatedProject && (
            <Button href={`/playground/${relatedProject.id}`} variant="ghost">
              View the project
            </Button>
          )
        }
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
  );
};

export default Page;
