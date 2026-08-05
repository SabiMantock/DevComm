import Link from "next/link";

const WelcomeCard = () => {
    return (
        <div className="welcome-card bg-dark-100 border-dark-200 flex w-full flex-col gap-4 rounded-[10px] border px-5 py-6">
            <div className="flex flex-col gap-2">
                <span className="text-light-100 text-sm leading-snug">
                    DevComm 1 is a guild for developers who'd rather ask than stay stuck — drop your questions, share what you learned, and help the next person out.
                </span>
                <span className="text-light-200 text-xs tracking-wide">Ask · Respond · Share</span>
            </div>

            <Link
                href="/code-of-conduct"
                className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-sm font-semibold text-black transition-colors"
            >
                Read the guild rules
            </Link>
        </div>
    )
}

export default WelcomeCard
