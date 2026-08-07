import Button from "@/components/Button";

const NotFound = () => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center">Page not found</h1>
      <p className="text-light-100 text-center text-sm">We couldn&apos;t find what you were looking for.</p>
      <Button href="/" variant="primary" className="mx-auto">
        Back to home
      </Button>
    </section>
  );
};

export default NotFound;
