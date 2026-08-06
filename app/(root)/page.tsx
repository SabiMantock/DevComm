import QuickPostBox from "@/components/QuickPostBox";
import FilterStrip from "@/components/FilterStrip";
import PostCard from "@/components/PostCard";
import WelcomeCard from "@/components/WelcomeCard";
import OpenQuests from "@/components/OpenQuests";
import PlaygroundHighlights from "@/components/PlaygroundHighlights";
import { posts } from "@/data/posts";

const Page = () => {
  return (
    <div className="flex flex-row items-start gap-8">
      <section className="flex-1">
        <QuickPostBox />
        <FilterStrip
          className="mt-6"
          groups={[{ label: "Filter by type", options: ["All", "Questions", "Tips", "Memes", "Wins"] }]}
        />
        <div className="post-list mt-8 flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      <aside className="hidden w-72 shrink-0 flex-col gap-6 lg:flex">
        <WelcomeCard />
        <OpenQuests />
        <PlaygroundHighlights />
      </aside>
    </div>
  );
};

export default Page;
