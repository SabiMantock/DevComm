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
    description: "Drag-and-drop task board with live updates across tabs via WebSockets.",
    stack: ["Next.js", "Tailwind"],
    status: "Shipped",
    liveUrl: "/",
    repoUrl: "/",
  },
  {
    id: "markdown-notes-app",
    title: "Markdown Notes App",
    description: "Local-first note-taking with a split-pane markdown editor and preview.",
    stack: ["React", "TypeScript"],
    status: "WIP",
    repoUrl: "/",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description: "Pulls a public weather API into a small dashboard with hourly charts.",
    stack: ["Next.js", "Chart.js"],
    status: "Shipped",
    liveUrl: "/",
  },
  {
    id: "pixel-runner",
    title: "Pixel Runner",
    description: "A tiny endless-runner game built to learn canvas and game loops.",
    stack: ["JavaScript", "Canvas"],
    status: "WIP",
  },
  {
    id: "cli-snippet-manager",
    title: "CLI Snippet Manager",
    description: "Save and search reusable code snippets straight from the terminal.",
    stack: ["Node.js", "TypeScript"],
    status: "Shipped",
    liveUrl: "/",
    repoUrl: "/",
  },
  {
    id: "recipe-finder",
    title: "Recipe Finder",
    description: "Search recipes by ingredients you already have on hand.",
    stack: ["React", "REST API"],
    status: "WIP",
    repoUrl: "/",
  },
];
