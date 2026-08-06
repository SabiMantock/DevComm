import Link from "next/link";

const Page = () => {
    return (
        <section className="flex flex-col gap-10">
            <h1 className="text-center">Contact</h1>

            <div className="flex flex-col gap-4">
                <h3>Reach the guild admins</h3>
                <p className="text-light-100 text-sm leading-snug">
                    There&apos;s no dedicated contact channel yet — for now, reach out via{" "}
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                    >
                        GitHub
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
};

export default Page;
