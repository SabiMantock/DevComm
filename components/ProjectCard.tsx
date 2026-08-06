import Link from "next/link";
import Card from "@/components/Card";
import ProjectMeta from "@/components/ProjectMeta";
import type { Project } from "@/data/projects";

type ProjectCardProps = Project;

export const statusClassName: Record<ProjectCardProps["status"], string> = {
    Shipped: "bg-primary/10 text-primary border-primary/40",
    WIP: "bg-dark-200/60 text-light-200 border-dark-200",
};

const ProjectCard = ({ id, title, description, stack, status, liveUrl, repoUrl }: ProjectCardProps) => {
    return (
        <Card as="article" className="project-card border-dark-200 hover:border-primary/40 relative transition-colors">
            <Link href={`/playground/${id}`} className="absolute inset-0" aria-label={title} />

            <div className="bg-dark-200 aspect-video w-full rounded-[6px]" aria-hidden="true" />

            <div className="flex flex-row items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClassName[status]}`}>
                    {status}
                </span>
            </div>

            <p className="text-light-100 text-sm leading-snug">{description}</p>

            <div className="relative z-10 flex flex-col gap-4">
                <ProjectMeta stack={stack} liveUrl={liveUrl} repoUrl={repoUrl} />
            </div>
        </Card>
    )
}

export default ProjectCard
