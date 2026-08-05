const openQuests = [
    "Anyone dealt with hydration mismatch in server components?",
    "Best way to type a discriminated union from an API response?",
    "Why does my useEffect cleanup fire twice in dev mode?",
    "Is there a clean pattern for optimistic updates with server actions?",
];

const OpenQuests = () => {
    return (
        <div className="open-quests bg-dark-100 border-dark-200 flex w-full flex-col gap-3 rounded-[10px] border px-4 py-4">
            <span className="text-sm font-semibold">Open quests</span>

            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {openQuests.map((title) => (
                    <li
                        key={title}
                        className="text-light-200 hover:text-light-100 cursor-pointer text-xs leading-snug transition-colors"
                    >
                        {title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OpenQuests
