"use client";

import { useState } from "react";
import FilterStrip from "@/components/FilterStrip";
import PostCard from "@/components/PostCard";
import WelcomeCard from "@/components/WelcomeCard";
import OpenQuests from "@/components/OpenQuests";
import PlaygroundHighlights from "@/components/PlaygroundHighlights";
import { posts } from "@/data/posts";

const Page = () => {
  const [activeType, setActiveType] = useState("All");

  const filteredPosts = activeType === "All" ? posts : posts.filter((post) => post.tags.includes(activeType));

  return (
    <div className="flex flex-row items-start gap-8">
      <section className="flex-1">
        <FilterStrip
          className="mt-6"
          groups={[{ label: "Filter by type", options: ["All", "Questions", "Tips", "Memes", "Wins"] }]}
          value={{ "Filter by type": activeType }}
          onChange={(_, option) => setActiveType(option)}
        />
        <div className="post-list mt-8 flex flex-col gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} {...post} />)
          ) : (
            <p className="text-light-200 text-sm">No posts match this filter.</p>
          )}
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
