"use client";

import { useState } from "react";
import Button from "@/components/Button";
import FilterStrip from "@/components/FilterStrip";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const Page = () => {
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  const filteredProjects = projects.filter(
    (project) =>
      (activeType === "All" || project.type === activeType) &&
      (activeStatus === "All" || project.status === activeStatus),
  );

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
        value={{ "Filter by type": activeType, "Filter by status": activeStatus }}
        onChange={(groupLabel, option) => {
          if (groupLabel === "Filter by type") setActiveType(option);
          if (groupLabel === "Filter by status") setActiveStatus(option);
        }}
      />

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      ) : (
        <p className="text-light-200 text-sm">No projects match these filters.</p>
      )}
    </section>
  );
};

export default Page;
