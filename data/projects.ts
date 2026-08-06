export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  status: "WIP" | "Shipped";
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    id: "realtime-kanban-board",
    title: "Realtime Kanban Board",
    description:
      "A Trello-style drag-and-drop task board where every move is broadcast over WebSockets, so teammates see cards land in real time instead of on the next refresh. Built with Next.js and Tailwind, with optimistic updates on drop and fractional indexing to keep card ordering consistent when multiple people reorder the same column at once.",
    stack: ["Next.js", "Tailwind"],
    status: "Shipped",
    liveUrl: "/",
    repoUrl: "/",
  },
  {
    id: "markdown-notes-app",
    title: "Markdown Notes App",
    description:
      "A local-first note-taking app with a split-pane markdown editor and a live-rendered preview side by side. Notes are persisted straight to the browser via IndexedDB, so there's no account and no server round trip just to save a note.",
    stack: ["React", "TypeScript"],
    status: "WIP",
    repoUrl: "/",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description:
      "A small dashboard that pulls a public weather API into an hourly temperature and precipitation chart for the next 48 hours, plus a simple daily summary strip. Requests are proxied and cached through a Next.js route handler so refreshing the page doesn't hammer the upstream API.",
    stack: ["Next.js", "Chart.js"],
    status: "Shipped",
    liveUrl: "/",
  },
  {
    id: "pixel-runner",
    title: "Pixel Runner",
    description:
      "A one-button endless runner built to learn how a canvas game loop actually works, with obstacles, a scrolling background, and a slowly increasing speed curve. Movement is delta-time based so the game plays at the same speed regardless of the display's refresh rate.",
    stack: ["JavaScript", "Canvas"],
    status: "WIP",
  },
  {
    id: "cli-snippet-manager",
    title: "CLI Snippet Manager",
    description:
      "A terminal tool for saving and finding reusable code snippets without leaving the command line. Snippets are stored as plain JSON in a local dotfile and searched with a lightweight fuzzy-matching scorer across tags, language, and snippet body.",
    stack: ["Node.js", "TypeScript"],
    status: "Shipped",
    liveUrl: "/",
    repoUrl: "/",
  },
  {
    id: "recipe-finder",
    title: "Recipe Finder",
    description:
      "Search for recipes using the ingredients already sitting in your fridge, ranked by how few extra things you'd need to buy. A React frontend sits over a public recipe API, with an ingredient-alias layer that normalizes names like \"scallion\" and \"green onion\" before querying.",
    stack: ["React", "REST API"],
    status: "WIP",
    repoUrl: "/",
  },
];
