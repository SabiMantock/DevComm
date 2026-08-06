import Link from "next/link";

const Page = () => {
    return (
        <section className="flex flex-col gap-10">
            <h1 className="text-center">About DevComm 1</h1>

            <div className="flex flex-col gap-4">
                <p className="text-light-100 text-sm leading-snug">
                    DevComm 1 is a local guild of programmers — a place to ask questions, share tips
                    and tricks, post memes, and showcase what you&apos;re building. The vibe leans
                    into a &quot;hellish realm for devs&quot; theme — members party up to survive and
                    thrive together — but the actual purpose is straightforward: collaborative
                    problem solving.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h3>The core loop</h3>
                <p className="text-light-100 text-sm leading-snug">
                    Ask, respond, share — see the{" "}
                    <Link href="/code-of-conduct" className="text-blue hover:underline">
                        Code of Conduct
                    </Link>{" "}
                    for the full cycle.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h3>Open source</h3>
                <p className="text-light-100 text-sm leading-snug">
                    DevComm 1 is open source and built with Next.js.{" "}
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                    >
                        View the repo on GitHub
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
};

export default Page;
