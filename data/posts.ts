export type Post = {
  id: string;
  author: string;
  timestamp: string;
  title: string;
  tags: string[];
  replies: number;
};

export const posts: Post[] = [
  {
    id: "nested-server-state",
    author: "Jordan Lee",
    timestamp: "2h ago",
    title: "How do you handle state across nested server components?",
    tags: ["Questions", "Next.js"],
    replies: 12,
  },
  {
    id: "shipped-first-side-project",
    author: "Priya Nair",
    timestamp: "5h ago",
    title: "Shipped my first side project this weekend 🎉",
    tags: ["Wins"],
    replies: 4,
  },
  {
    id: "usedeferredvalue-debounce-til",
    author: "Marcus Chen",
    timestamp: "1d ago",
    title: "TIL: you can debounce with useDeferredValue instead of a custom hook",
    tags: ["Tips", "React"],
    replies: 8,
  },
  {
    id: "code-works-dont-know-why",
    author: "Ava Thompson",
    timestamp: "2d ago",
    title: "When your code finally works but you don't know why",
    tags: ["Memes"],
    replies: 21,
  },
];
