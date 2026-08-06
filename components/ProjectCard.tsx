import Card from "@/components/Card";
import FooterLink from "@/components/FooterLink";

type ProjectCardProps = {
    title: string;
    description: string;
    stack: string[];
    status: "WIP" | "Shipped";
    liveUrl?: string;
    repoUrl?: string;
};

const statusClassName: Record<ProjectCardProps["status"], string> = {
    Shipped: "bg-primary/10 text-primary border-primary/40",
    WIP: "bg-dark-200/60 text-light-200 border-dark-200",
};

const ProjectCard = ({ title, description, stack, status, liveUrl, repoUrl }: ProjectCardProps) => {
    return (
        <Card as="article" className="project-card">
            <div className="bg-dark-200 aspect-video w-full rounded-[6px]" aria-hidden="true" />

            <div className="flex flex-row items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClassName[status]}`}>
                    {status}
                </span>
            </div>

            <p className="text-light-100 text-sm leading-snug">{description}</p>

            <div className="flex flex-row flex-wrap gap-2">
                {stack.map((tech) => (
                    <span key={tech} className="pill">
                        #{tech.toLowerCase().replace(/[^a-z0-9]/g, "")}
                    </span>
                ))}
            </div>

            {(liveUrl || repoUrl) && (
                <div className="flex flex-row items-center gap-4">
                    {liveUrl && <FooterLink href={liveUrl} label="Live demo" external />}
                    {repoUrl && <FooterLink href={repoUrl} label="Repo" external />}
                </div>
            )}
        </Card>
    )
}

export default ProjectCard
