import Button from "@/components/Button";
import FilterStrip from "@/components/FilterStrip";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const Page = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-row items-center justify-between">
        <h1>Playground</h1>
        <Button href="/playground/new">Share a project</Button>
      </div>

      <FilterStrip
        groups={[
          { label: "Filter by type", options: ["All", "Web app", "Tool", "Game", "Script"] },
          { label: "Filter by status", options: ["All", "WIP", "Shipped"] },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Page;
