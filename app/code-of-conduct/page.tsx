const coreLoop = [
    {
        title: "Have a question? Ask.",
        body: "The main purpose of the guild is collaborative problem solving. Whenever you hit an obstacle, no matter how nuanced, you can ask with the assurance you'll find help.",
    },
    {
        title: "Have an answer? Respond.",
        body: "No one knows it all. Share your experience or thoughts on tackling an issue, even if it's not the full solution.",
    },
    {
        title: "Found a solution? Share.",
        body: "Whether it's the right answer, a hack, or a stopgap, share it and discuss.",
    },
];

const rulesOfEngagement = [
    "No advertisements except related side-quests and job opportunities.",
    "No harassment, mockery, bashing, or trolling — respect every member's questions and contributions, no matter how trivial they may seem.",
    "No sharing of unrelated content — stay on topic.",
];

const Page = () => {
    return (
        <section className="flex flex-col gap-10">
            <h1 className="text-center">Code of Conduct</h1>

            <div className="flex flex-col gap-4">
                <h3>The core loop</h3>
                <p className="text-light-100 text-sm leading-snug">
                    DevComm runs on one simple cycle — keep it turning:
                </p>
                <div className="flex flex-col gap-4">
                    {coreLoop.map((item) => (
                        <div key={item.title} className="flex flex-col gap-1">
                            <span className="font-semibold">{item.title}</span>
                            <span className="text-light-100 text-sm leading-snug">{item.body}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3>Rules of engagement</h3>
                <ul className="text-light-100 space-y-2 text-sm leading-snug">
                    {rulesOfEngagement.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Page;
