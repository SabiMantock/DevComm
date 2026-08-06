import CTAButton from "@/components/CTAButton";
import FilterStrip from "@/components/FilterStrip";

const Page = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-row items-center justify-between">
        <h1>Playground</h1>
        <CTAButton>Share a project</CTAButton>
      </div>

      <FilterStrip
        groups={[
          { label: "Filter by type", options: ["All", "Web app", "Tool", "Game", "Script"] },
          { label: "Filter by status", options: ["All", "WIP", "Shipped"] },
        ]}
      />
    </section>
  );
};

export default Page;
