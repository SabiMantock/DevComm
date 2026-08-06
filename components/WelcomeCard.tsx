import Button from "@/components/Button";
import Card from "@/components/Card";

const WelcomeCard = () => {
    return (
        <Card className="welcome-card">
            <div className="flex flex-col gap-2">
                <span className="text-light-100 text-sm leading-snug">
                    DevComm 1 is a guild for developers who'd rather ask than stay stuck — drop your questions, share what you learned, and help the next person out.
                </span>
                <span className="text-light-200 text-xs tracking-wide">Ask · Respond · Share</span>
            </div>

            <Button href="/code-of-conduct" className="w-full">
                Read the guild rules
            </Button>
        </Card>
    )
}

export default WelcomeCard
