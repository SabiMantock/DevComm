"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor";

const inputClassName =
  "bg-dark-100 border-dark-200 placeholder:text-light-200 w-full rounded-[6px] border px-4 py-2.5 text-sm";
const labelClassName = "text-sm font-semibold";

const Page = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [writeUp, setWriteUp] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [stackDraft, setStackDraft] = useState("");
  const [status, setStatus] = useState<"WIP" | "Shipped">("WIP");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const addStackTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const tag = stackDraft.trim();
    setStackDraft("");
    if (!tag || stack.includes(tag)) return;

    setStack((prev) => [...prev, tag]);
  };

  const removeStackTag = (tag: string) => {
    setStack((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // No shared client store or backend yet (see AGENTS.md's build-order guardrail),
    // so a submitted project can't actually be added to data/projects.ts or show up
    // in the Playground grid. Reset the form and send the user back to Playground
    // until real persistence exists.
    setTitle("");
    setSummary("");
    setWriteUp("");
    setStack([]);
    setStackDraft("");
    setStatus("WIP");
    setLiveUrl("");
    setRepoUrl("");

    router.push("/playground");
  };

  return (
    <section className="flex flex-col gap-10">
      <h1>Share a project</h1>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Realtime Kanban Board"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClassName}>Screenshot</span>
          {/* Placeholder dropzone only — no real file upload/storage logic yet. */}
          <div className="border-dark-200 text-light-200 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed text-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M7 9l5-5 5 5M12 4v12"
              />
            </svg>
            Upload image
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="summary" className={labelClassName}>
            Short summary
          </label>
          <textarea
            id="summary"
            required
            rows={3}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="One or two sentences — this is what shows on the project card."
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="stack" className={labelClassName}>
            Stack
          </label>
          <input
            id="stack"
            type="text"
            value={stackDraft}
            onChange={(event) => setStackDraft(event.target.value)}
            onKeyDown={addStackTag}
            placeholder="Type a technology and press Enter"
            className={inputClassName}
          />
          {stack.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2">
              {stack.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeStackTag(tag)}
                  className="pill hover:text-primary transition-colors"
                >
                  #{tag.toLowerCase().replace(/[^a-z0-9]/g, "")} ×
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClassName}>Status</span>
          <div className="flex flex-row items-center gap-6">
            {(["WIP", "Shipped"] as const).map((option) => (
              <label key={option} className="text-light-100 flex flex-row items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="status"
                  checked={status === option}
                  onChange={() => setStatus(option)}
                  className="accent-primary"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="liveUrl" className={labelClassName}>
            Live demo URL <span className="text-light-200 font-normal">(optional)</span>
          </label>
          <input
            id="liveUrl"
            type="url"
            value={liveUrl}
            onChange={(event) => setLiveUrl(event.target.value)}
            placeholder="https://..."
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="repoUrl" className={labelClassName}>
            Repo URL <span className="text-light-200 font-normal">(optional)</span>
          </label>
          <input
            id="repoUrl"
            type="url"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/..."
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClassName}>
            Longer write-up <span className="text-light-200 font-normal">(optional)</span>
          </span>
          <RichTextEditor
            value={writeUp}
            onChange={setWriteUp}
            placeholder="What it does, how it's built, tradeoffs you made — leave blank to just reuse the short summary above."
          />
        </div>

        <Button type="submit" className="self-start">
          Share project
        </Button>
      </form>
    </section>
  );
};

export default Page;
