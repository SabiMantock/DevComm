import ArticleInteractions from "@/components/ArticleInteractions";
import ProjectMeta from "@/components/ProjectMeta";
import Button from "@/components/Button";
import { statusClassName } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const dummyComments = [
  {
    id: "c1",
    author: "Sam Rivera",
    timestamp: "2h ago",
    body: "Really clean write-up, love seeing the tricky parts called out instead of just the happy path.",
  },
  {
    id: "c2",
    author: "Devon Park",
    timestamp: "1h ago",
    body: "Nice stack choice. Would love to see a follow-up post digging into the setup.",
  },
  {
    id: "c3",
    author: "Lena Ortiz",
    timestamp: "20m ago",
    body: "Bookmarking this, want to try building something similar.",
  },
];

const Page = async (props: PageProps<"/playground/[id]">) => {
  const { id } = await props.params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-center">Project not found</h1>
        <p className="text-light-100 text-center text-sm">We couldn&apos;t find a project with that id.</p>
      </section>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <div className="bg-dark-200 aspect-[21/9] w-full rounded-[10px]" aria-hidden="true" />

      <div className="flex flex-row items-center gap-3">
        <div className="bg-dark-200 h-10 w-10 shrink-0 rounded-[6px]" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Playground submission</span>
          <span className="text-light-200 text-xs">Built with {project.stack.join(", ")}</span>
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-between gap-3">
        <h1>{project.title}</h1>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClassName[project.status]}`}>
          {project.status}
        </span>
      </div>

      <ArticleInteractions
        initialLikes={18 + project.stack.length * 3}
        initialComments={dummyComments}
        secondaryAction={
          <Button href={`/new?project=${project.id}`} variant="ghost">
            Make a post about it
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-light-100 text-sm leading-relaxed">{project.description}</p>

          <ProjectMeta stack={project.stack} liveUrl={project.liveUrl} repoUrl={project.repoUrl} />
        </div>
      </ArticleInteractions>
    </article>
  );
};

export default Page;
