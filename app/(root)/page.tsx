import QuickPostBox from "@/components/QuickPostBox";
import FilterStrip from "@/components/FilterStrip";
import PostCard from "@/components/PostCard";

const dummyPosts = [
  {
    author: "Jordan Lee",
    timestamp: "2h ago",
    title: "How do you handle state across nested server components?",
    tags: ["Questions", "Next.js"],
    replies: 12,
  },
  {
    author: "Priya Nair",
    timestamp: "5h ago",
    title: "Shipped my first side project this weekend 🎉",
    tags: ["Wins"],
    replies: 4,
  },
  {
    author: "Marcus Chen",
    timestamp: "1d ago",
    title: "TIL: you can debounce with useDeferredValue instead of a custom hook",
    tags: ["Tips", "React"],
    replies: 8,
  },
  {
    author: "Ava Thompson",
    timestamp: "2d ago",
    title: "When your code finally works but you don't know why",
    tags: ["Memes"],
    replies: 21,
  },
];

const Page = () => {
  return (
    <section>
      <QuickPostBox />
      <FilterStrip />
      <div className="post-list mt-8 flex flex-col gap-4">
        {dummyPosts.map((post) => (
          <PostCard key={post.title} {...post} />
        ))}
      </div>
    </section>
  );
};

export default Page;
