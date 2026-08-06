export type Post = {
  id: string;
  author: string;
  timestamp: string;
  title: string;
  tags: string[];
  replies: number;
  body: string;
  /** Whether this post has a cover image. No real asset yet — renders as a placeholder block. */
  coverImage?: boolean;
  /** Id of a related project in data/projects.ts, when this post is about one. */
  projectId?: string;
};

export const posts: Post[] = [
  {
    id: "nested-server-state",
    author: "Jordan Lee",
    timestamp: "2h ago",
    title: "How do you handle state across nested server components?",
    tags: ["Questions", "Next.js"],
    replies: 12,
    projectId: "realtime-kanban-board",
    body: `I've got a layout with a server component at the top, a couple of server components nested a few levels down, and a handful of client islands sprinkled throughout. The problem: two of those client islands need to react to the same piece of state (a selected "workspace"), but they don't share a parent client component — the closest common ancestor is a server component, and you can't just drop a Context.Provider there.

My first instinct was to lift the state into a client component wrapping everything, but that turns almost the entire tree into client components again, which defeats the point of fetching data on the server in the nested pieces. I tried the URL as the source of truth instead — a searchParam for the active workspace — and that actually worked better than expected. Both client islands read it with useSearchParams, and the server components above them read it via the params/searchParams prop and refetch accordingly.

The tradeoff is that every workspace switch is a navigation, which means a round trip, even though nothing above the fold visually changes. I'm now looking at whether a thin client "provider" component placed just above the two islands (still leaving the heavier data-fetching components as server components) is a better middle ground than routing through the URL for everything. Anyone landed on a pattern they're happy with for this?`,
  },
  {
    id: "shipped-first-side-project",
    author: "Priya Nair",
    timestamp: "5h ago",
    title: "Shipped my first side project this weekend 🎉",
    tags: ["Wins"],
    replies: 4,
    coverImage: true,
    body: `I finally pushed the "Publish" button on a tiny habit tracker I've been poking at for the last three weekends. Nothing fancy — a streak counter, a calendar heatmap, and a way to log a habit with one tap — but it's the first thing I've built end to end and actually deployed instead of leaving in a half-finished repo.

The last stretch was rough. I got stuck for way too long on the heatmap component fighting with CSS grid before realizing I was overcomplicating it and a simple flex-wrap would've done the job in a tenth of the code. Classic case of reaching for the "correct" solution before trying the boring one.

It's live now, it's ugly in places, and I already have a list of five things I want to fix. But it's out there, real people other than me can use it, and that feels completely different from another repo sitting untouched on my GitHub profile. If anyone wants to poke around and tell me what's broken, I will take all the brutal feedback you've got.`,
  },
  {
    id: "usedeferredvalue-debounce-til",
    author: "Marcus Chen",
    timestamp: "1d ago",
    title: "TIL: you can debounce with useDeferredValue instead of a custom hook",
    tags: ["Tips", "React"],
    replies: 8,
    body: `I've had a "useDebounce" hook copy-pasted into basically every project I've worked on for years — wrap a value in a useEffect, set a timeout, clear it on the next keystroke, done. Today I ripped it out of a search-filter component and replaced it with useDeferredValue instead, and it's honestly a better fit for what I was actually trying to do.

The difference in behavior is subtle but matters: a timer-based debounce waits for a fixed delay after you stop typing, regardless of how expensive the actual filtering work is. useDeferredValue instead lets React keep the input responsive and defers re-rendering the expensive list until the browser has a spare moment — so on a fast machine filtering a small list, it updates almost immediately, and on a slow machine filtering a huge list, it backs off automatically instead of you having to hand-tune a delay in milliseconds.

The one gotcha I ran into: you still want to visually indicate that the results are stale while the deferred value catches up, otherwise it can look like typing did nothing for a beat. I ended up comparing the deferred value against the live input value and dropping a bit of opacity on the list when they're out of sync. Not a drop-in replacement for every debounce use case — anything hitting a network request still wants an actual timer — but for filtering data that's already in memory, this removed a whole hook from my codebase.`,
  },
  {
    id: "code-works-dont-know-why",
    author: "Ava Thompson",
    timestamp: "2d ago",
    title: "When your code finally works but you don't know why",
    tags: ["Memes"],
    replies: 21,
    coverImage: true,
    body: `Spent three hours convinced a race condition was corrupting my state. Added logging. Added more logging. Wrapped half the function in try/catch just to see what was actually happening. Rewrote the reducer twice. Nothing.

Then, out of pure desperation, I deleted a semicolon that autoformat had added, retyped the exact same semicolon, saved the file, and it worked. Every time. I have no explanation. I removed the extra console.logs, and it still works. I am choosing not to investigate further because I am afraid of what I'll find, and also afraid of what I won't.

This is now permanently filed under "things I am not allowed to touch again," right next to the config file from my last job that nobody could explain but everyone was terrified to delete. If you know, you know.`,
  },
];
