import FooterLink from "@/components/FooterLink";

type ProjectMetaProps = {
    stack: string[];
    liveUrl?: string;
    repoUrl?: string;
};

/** Stack tags + Live demo/Repo links. Shared by ProjectCard and the project detail page. */
const ProjectMeta = ({ stack, liveUrl, repoUrl }: ProjectMetaProps) => {
    return (
        <>
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
        </>
    )
}

export default ProjectMeta
