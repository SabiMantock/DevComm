import CTAButton from "@/components/CTAButton";

const Page = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-row items-center justify-between">
        <h1>Playground</h1>
        <CTAButton>Share a project</CTAButton>
      </div>
    </section>
  );
};

export default Page;
