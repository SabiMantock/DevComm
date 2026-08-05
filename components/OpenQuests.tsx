const openQuests = [
    { title: "Anyone dealt with hydration mismatch in server components?", replies: 9 },
    { title: "Best way to type a discriminated union from an API response?", replies: 6 },
    { title: "Why does my useEffect cleanup fire twice in dev mode?", replies: 4 },
    { title: "Is there a clean pattern for optimistic updates with server actions?", replies: 2 },
];

const OpenQuests = () => {
    return (
        <div className="open-quests flex w-full flex-col gap-3">
            <span className="text-sm font-semibold">Open quests</span>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {openQuests.map((quest) => (
                    <li key={quest.title} className="flex cursor-pointer flex-col gap-0.5">
                        <span className="text-light-100 hover:text-primary text-sm leading-snug transition-colors">
                            {quest.title}
                        </span>
                        <span className="text-light-200 text-xs">
                            {quest.replies} {quest.replies === 1 ? "reply" : "replies"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OpenQuests
