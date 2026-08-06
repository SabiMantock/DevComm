import CTAButton from "@/components/CTAButton";

const WelcomeCard = () => {
    return (
        <div className="welcome-card bg-dark-100 border-dark-200 flex w-full flex-col gap-4 rounded-[10px] border px-5 py-6">
            <div className="flex flex-col gap-2">
                <span className="text-light-100 text-sm leading-snug">
                    DevComm 1 is a guild for developers who'd rather ask than stay stuck — drop your questions, share what you learned, and help the next person out.
                </span>
                <span className="text-light-200 text-xs tracking-wide">Ask · Respond · Share</span>
            </div>

            <CTAButton href="/code-of-conduct" className="w-full">
                Read the guild rules
            </CTAButton>
        </div>
    )
}

export default WelcomeCard
