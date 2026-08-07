import PostArticle from "@/components/PostArticle";
import type { Comment } from "@/components/ArticleInteractions";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";

const dummyComments: Comment[] = [
  {
    id: "c1",
    author: "Sam Rivera",
    timestamp: "1h ago",
    body: "This is exactly the kind of thing I needed to read today, thanks for writing it up.",
    likes: 3,
    liked: false,
    replies: [],
  },
  {
    id: "c2",
    author: "Devon Park",
    timestamp: "40m ago",
    body: "Solid take. Following this thread.",
    likes: 1,
    liked: false,
    replies: [],
  },
  {
    id: "c3",
    author: "Lena Ortiz",
    timestamp: "12m ago",
    body: "Had almost the exact same experience last week, good to know I'm not the only one.",
    likes: 0,
    liked: false,
    replies: [],
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

  const relatedProject = post.projectId ? projects.find((p) => p.id === post.projectId) : undefined;
  const moreFromAuthor = posts.filter((p) => p.author === post.author && p.id !== post.id).slice(0, 3);

  return (
    <PostArticle
      post={post}
      relatedProject={relatedProject}
      initialComments={dummyComments}
      moreFromAuthor={moreFromAuthor}
    />
  );
};

export default Page;
