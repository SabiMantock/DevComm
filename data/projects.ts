export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  status: "WIP" | "Shipped";
  liveUrl?: string;
  repoUrl?: string;
  details: string;
};

export const projects: Project[] = [
  {
    id: "realtime-kanban-board",
    title: "Realtime Kanban Board",
    description: "Drag-and-drop task board with live updates across tabs via WebSockets.",
    stack: ["Next.js", "Tailwind"],
    status: "Shipped",
    liveUrl: "/",
    repoUrl: "/",
    details: `A Trello-style board where cards can be dragged between columns, backed by a small WebSocket server so every open tab (and every teammate) sees moves land in real time instead of on the next refresh. The board itself is a Next.js app; drag-and-drop is handled client-side, and every drop fires an optimistic update locally before the change is confirmed over the socket.

The trickiest part turned out to be ordering, not the drag-and-drop itself. Two people dragging cards into the same column at the same moment can easily produce conflicting orderings if you're just storing an array index. I switched to fractional indexing — each card stores a position as a float between its neighbors — so concurrent inserts almost always resolve without a full reorder, and the rare collision just needs a tie-break on card ID rather than a broadcast reshuffle of the whole column.

Reconnection was the other fun problem: if a tab drops its WebSocket connection for a few seconds (laptop sleep, flaky wifi), it needs to catch up on everything it missed without replaying every single move. It refetches the board's current state on reconnect and diffs against local state rather than trusting a backlog of events, which turned out to be both simpler and more resilient than trying to guarantee delivery of every intermediate message.`,
  },
  {
    id: "markdown-notes-app",
    title: "Markdown Notes App",
    description: "Local-first note-taking with a split-pane markdown editor and preview.",
    stack: ["React", "TypeScript"],
    status: "WIP",
    repoUrl: "/",
    details: `A split-pane editor: markdown source on the left, a live-rendered preview on the right, everything persisted to the browser so there's no account and no server round trip to save a note. Notes live in IndexedDB rather than localStorage, mainly because localStorage's synchronous API started to noticeably block typing once a note got long.

The preview re-renders on every keystroke by parsing the markdown with a small unified/remark pipeline and diffing the resulting HTML tree, rather than re-rendering the whole pane from scratch — that's what keeps typing feeling instant even in a note with a few thousand words. The part that's still not quite right is scroll sync: I want the preview to scroll to roughly the same position as the cursor in the source, and mapping a character offset in markdown to a pixel offset in fairly different rendered HTML (headings, code blocks, and lists all take up very different amounts of vertical space per line of source) is fuzzier than I expected — right now it's an approximation based on line number that drifts on longer documents.

Still on the todo list: a command palette for inserting markdown syntax, and figuring out export (right now "exporting" a note means copying the raw markdown, which works but isn't great for anyone who wants a PDF or a shareable link).`,
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description: "Pulls a public weather API into a small dashboard with hourly charts.",
    stack: ["Next.js", "Chart.js"],
    status: "Shipped",
    liveUrl: "/",
    details: `A small dashboard that takes a city (or your current location, if you allow it) and renders an hourly temperature and precipitation chart for the next 48 hours, plus a simple daily summary strip. Data comes from a free public weather API — no key management needed on the client since requests are proxied through a Next.js route handler, which also gives a spot to cache responses for a few minutes so refreshing the page doesn't hammer the upstream API.

Chart.js handles the hourly line chart; the fiddly part was overlaying precipitation probability as a secondary axis without it visually fighting the temperature line for attention, which took a few passes at color and opacity before it read cleanly at a glance rather than as two charts stacked on top of each other.

Timezones turned out to be the real source of bugs, not the charting. The API returns timestamps in the location's local time, but "now" on the client is in the browser's timezone, and lining up "the next 48 hours starting from the current hour" without off-by-one errors near midnight or DST boundaries took more test cases than I expected. It's solid now, but that was not the part of this project I thought I'd be spending an afternoon debugging.`,
  },
  {
    id: "pixel-runner",
    title: "Pixel Runner",
    description: "A tiny endless-runner game built to learn canvas and game loops.",
    stack: ["JavaScript", "Canvas"],
    status: "WIP",
    details: `A one-button endless runner — jump over obstacles, survive as long as possible, watch the speed creep up — built mainly as an excuse to learn how a game loop actually works instead of using a game engine. Everything renders to a single <canvas> element: the ground, the sprite, obstacles, and score are all just drawn imperatively on every frame via requestAnimationFrame.

The thing that broke the game early on was tying movement speed directly to frame rate — it played at a totally different speed on a 60Hz laptop versus a 144Hz monitor. Switching to delta-time-based movement (multiplying velocity by the milliseconds elapsed since the last frame rather than assuming a fixed frame duration) fixed it, but it meant rewriting collision detection too, since obstacles could now move a variable distance between frames and "did the sprite's bounding box overlap this frame" isn't quite enough once you're covering more ground per frame at higher speeds.

Sprite animation (the little run cycle) is just a spritesheet with a frame index that increments on a separate timer from the physics update, which was a good reminder that "how often something moves" and "how often something visually changes" don't have to be the same clock. Still to do: sound effects, and a properly tuned difficulty curve instead of the current "speed increases by a fixed amount every 10 seconds," which gets brutal fast.`,
  },
  {
    id: "cli-snippet-manager",
    title: "CLI Snippet Manager",
    description: "Save and search reusable code snippets straight from the terminal.",
    stack: ["Node.js", "TypeScript"],
    status: "Shipped",
    liveUrl: "/",
    repoUrl: "/",
    details: `A small CLI, built on Commander, for saving and finding code snippets without leaving the terminal — save the last thing you copied with a tag, then fuzzy-search across all saved snippets by tag, language, or content and pipe the result straight back to your clipboard or into a file. Snippets are stored as plain JSON in a dotfile in the home directory, deliberately — no database, nothing to set up, easy to inspect or hand-edit if something looks wrong.

Fuzzy search across snippet bodies (not just titles) was the part that took the longest to get right. A naive substring match missed anything with slightly different variable names or formatting, but a full fuzzy-matching library felt like overkill for what's essentially a local text file. I landed on a lightweight scoring approach — tokenize the query and the snippet, score by token overlap plus a bonus for matches in the tag list — which is nowhere near as sophisticated as a real search index but works well for a personal collection of a few hundred snippets.

The one thing it deliberately doesn't do yet is sync across machines. Everything lives in that one local JSON file, so snippets saved on a laptop don't show up on a desktop. It's tempting to bolt on a sync mechanism, but that turns a five-minute tool into something that needs auth and conflict resolution, so for now it stays single-machine on purpose.`,
  },
  {
    id: "recipe-finder",
    title: "Recipe Finder",
    description: "Search recipes by ingredients you already have on hand.",
    stack: ["React", "REST API"],
    status: "WIP",
    repoUrl: "/",
    details: `The pitch is simple: type in the ingredients sitting in your fridge, and get back recipes that use most of them, ranked by how few extra things you'd need to buy. It's a React frontend over a public recipe API, with a multi-select ingredient picker that autocompletes against the API's ingredient list as you type.

The API matches ingredients by exact name, which sounds fine until you realize "scallion," "green onion," and "spring onion" are the same thing to a human and three different strings to the API. A chunk of this project ended up being a small synonym-mapping layer on top of the raw API results — normalizing common ingredient aliases before sending the query — so "I have green onions" actually surfaces recipes tagged with any of its common names instead of only the exact one the API expects.

Ranking "how few extra things you'd need to buy" also isn't something the API gives you directly — it returns recipes that match at least one ingredient, not a ranked list by overlap. So results get re-sorted client-side by computing the overlap between your selected ingredients and each recipe's full ingredient list. Still open: recipes with a long "optional garnish" tail unfairly rank lower than ones that just don't list optional extras, and untangling "required" from "optional" ingredients isn't consistent across the API's data, so that's the next thing to dig into.`,
  },
];
