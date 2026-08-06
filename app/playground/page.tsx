const Page = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-row items-center justify-between">
        <h1>Playground</h1>
        <button
          type="button"
          className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-sm font-semibold text-black transition-colors"
        >
          Share a project
        </button>
      </div>
    </section>
  );
};

export default Page;
