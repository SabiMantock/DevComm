import Button from "@/components/Button";
import FilterStrip from "@/components/FilterStrip";
import ProjectCard from "@/components/ProjectCard";

const dummyProjects = [
  {
    title: "Realtime Kanban Board",
    description: "Drag-and-drop task board with live updates across tabs via WebSockets.",
    stack: ["Next.js", "Tailwind"],
    status: "Shipped" as const,
    liveUrl: "/",
    repoUrl: "/",
  },
  {
    title: "Markdown Notes App",
    description: "Local-first note-taking with a split-pane markdown editor and preview.",
    stack: ["React", "TypeScript"],
    status: "WIP" as const,
    repoUrl: "/",
  },
  {
    title: "Weather Dashboard",
    description: "Pulls a public weather API into a small dashboard with hourly charts.",
    stack: ["Next.js", "Chart.js"],
    status: "Shipped" as const,
    liveUrl: "/",
  },
  {
    title: "Pixel Runner",
    description: "A tiny endless-runner game built to learn canvas and game loops.",
    stack: ["JavaScript", "Canvas"],
    status: "WIP" as const,
  },
  {
    title: "CLI Snippet Manager",
    description: "Save and search reusable code snippets straight from the terminal.",
    stack: ["Node.js", "TypeScript"],
    status: "Shipped" as const,
    liveUrl: "/",
    repoUrl: "/",
  },
  {
    title: "Recipe Finder",
    description: "Search recipes by ingredients you already have on hand.",
    stack: ["React", "REST API"],
    status: "WIP" as const,
    repoUrl: "/",
  },
];

const Page = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-row items-center justify-between">
        <h1>Playground</h1>
        <Button>Share a project</Button>
      </div>

      <FilterStrip
        groups={[
          { label: "Filter by type", options: ["All", "Web app", "Tool", "Game", "Script"] },
          { label: "Filter by status", options: ["All", "WIP", "Shipped"] },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyProjects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Page;
