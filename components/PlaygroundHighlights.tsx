const playgroundHighlights = [
    { title: "Realtime Kanban Board", stack: "Next.js, Tailwind" },
    { title: "Markdown Notes App", stack: "React, TypeScript" },
    { title: "Weather Dashboard", stack: "Next.js, Chart.js" },
];

const PlaygroundHighlights = () => {
    return (
        <div className="playground-highlights flex w-full flex-col gap-3">
            <span className="text-sm font-semibold">Playground highlights</span>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {playgroundHighlights.map((project) => (
                    <li key={project.title} className="flex cursor-pointer flex-col gap-0.5">
                        <span className="text-light-100 hover:text-primary text-sm leading-snug transition-colors">
                            {project.title}
                        </span>
                        <span className="text-light-200 text-xs">{project.stack}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PlaygroundHighlights
