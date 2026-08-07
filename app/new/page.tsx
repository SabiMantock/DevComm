"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import RichTextEditor from "@/components/RichTextEditor";
import { projects } from "@/data/projects";

const MAX_TAGS = 4;

const NewPostForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [body, setBody] = useState("");
  const [linkedProjectId, setLinkedProjectId] = useState(() => searchParams.get("project"));

  const linkedProject = linkedProjectId ? projects.find((p) => p.id === linkedProjectId) : undefined;

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const tag = tagDraft.trim();
    setTagDraft("");
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;

    setTags((prev) => [...prev, tag]);
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // Local preview only — this is a real file from the user's computer, but there's
  // no shared client store or backend yet (see AGENTS.md's build-order guardrail) to
  // actually upload it to, so it never leaves the browser.
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverImageUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  };

  const removeCoverImage = () => {
    setCoverImageUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    if (coverImageInputRef.current) coverImageInputRef.current.value = "";
  };

  // Object URLs are only valid for this browser session — release it if the user
  // navigates away without submitting or removing it.
  useEffect(() => {
    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    };
  }, [coverImageUrl]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    // No shared client store or backend yet (see AGENTS.md's build-order guardrail),
    // so the post can't actually be added to data/posts.ts or show up in the feed.
    // Reset the form and send the user back home until real persistence exists.
    removeCoverImage();
    setTitle("");
    setTags([]);
    setTagDraft("");
    setBody("");
    setLinkedProjectId(null);

    router.push("/");
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg">New post</h1>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <Card className="gap-5">
          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          {coverImageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not eligible for next/image's remote optimization */}
              <img
                src={coverImageUrl}
                alt="Cover preview"
                className="aspect-21/9 w-full rounded-[10px] object-cover"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                aria-label="Remove cover image"
                className="bg-dark-100 text-light-100 hover:text-primary border-dark-200 absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border text-sm transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => coverImageInputRef.current?.click()}
              className="self-start"
            >
              Upload Cover Image
            </Button>
          )}

          <input
            type="text"
            required
            aria-label="Post title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="New post title here..."
            className="placeholder:text-light-200 w-full border-none bg-transparent text-3xl font-semibold outline-none md:text-4xl"
          />

          {linkedProject && <span className="pill text-light-200 self-start">Linked to: {linkedProject.title}</span>}

          <div className="flex flex-row flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="pill hover:text-primary transition-colors"
              >
                #{tag.toLowerCase().replace(/[^a-z0-9]/g, "")} ×
              </button>
            ))}
            {tags.length < MAX_TAGS && (
              <input
                type="text"
                aria-label="Add tags"
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={addTag}
                placeholder={`Add up to ${MAX_TAGS} tags...`}
                className="placeholder:text-light-200 min-w-40 flex-1 border-none bg-transparent text-sm outline-none"
              />
            )}
          </div>

          <RichTextEditor value={body} onChange={setBody} placeholder="Write your post content here..." />
        </Card>

        <Button type="submit" className="self-start">
          Post
        </Button>
      </form>
    </section>
  );
};

// useSearchParams (in NewPostForm) requires a Suspense boundary above it,
// otherwise production builds fail — see Next.js docs on useSearchParams.
const Page = () => (
  <Suspense>
    <NewPostForm />
  </Suspense>
);

export default Page;
