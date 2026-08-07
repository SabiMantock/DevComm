import { posts } from "@/data/posts";
import { projects } from "@/data/projects";

export type SearchEntry = {
  id: string;
  title: string;
  category: "Post" | "Project" | "Page";
  href: string;
  /** Extra terms matched against but not shown (e.g. tags/stack). */
  keywords?: string[];
};

// Not included: /new and /playground/new — those are creation forms, not content.
const staticPages: SearchEntry[] = [
  { id: "home", title: "Home", category: "Page", href: "/" },
  { id: "playground", title: "Playground", category: "Page", href: "/playground" },
  { id: "about", title: "About DevComm 1", category: "Page", href: "/about" },
  { id: "contact", title: "Contact", category: "Page", href: "/contact" },
  { id: "code-of-conduct", title: "Code of Conduct", category: "Page", href: "/code-of-conduct" },
  { id: "privacy-policy", title: "Privacy Policy", category: "Page", href: "/privacy-policy" },
  { id: "terms-of-use", title: "Terms of Use", category: "Page", href: "/terms-of-use" },
];

/** Flat, searchable index of posts, projects, and static pages — built once at import time. */
export const searchIndex: SearchEntry[] = [
  ...posts.map(
    (post): SearchEntry => ({
      id: post.id,
      title: post.title,
      category: "Post",
      href: `/post/${post.id}`,
      keywords: post.tags,
    }),
  ),
  ...projects.map(
    (project): SearchEntry => ({
      id: project.id,
      title: project.title,
      category: "Project",
      href: `/playground/${project.id}`,
      keywords: project.stack,
    }),
  ),
  ...staticPages,
];
