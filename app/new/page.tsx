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
  const tagDraftInputRef = useRef<HTMLInputElement>(null);
  // Set right before a setTags call that removes a tag to re-edit it, so the
  // effect below can refocus the draft input once it's back in the DOM —
  // removing the 4th tag makes the (previously hidden, tags.length ===
  // MAX_TAGS) draft input reappear only after this render commits, so a
  // plain ref.current.focus() call at click time would still find it null.
  const focusTagDraftRef = useRef(false);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [body, setBody] = useState("");
  const [linkedProjectId, setLinkedProjectId] = useState(() => searchParams.get("project"));

  const linkedProject = linkedProjectId ? projects.find((p) => p.id === linkedProjectId) : undefined;

  useEffect(() => {
    if (!focusTagDraftRef.current) return;
    focusTagDraftRef.current = false;
    tagDraftInputRef.current?.focus();
  }, [tags]);

  const commitTagDraft = () => {
    const tag = tagDraft.trim();
    setTagDraft("");
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;

    setTags((prev) => [...prev, tag]);
  };

  const handleTagDraftKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter or Space commits the draft as a tag — Space matches how most
    // tag inputs behave, since typing a literal space into a single-word
    // tag isn't useful anyway.
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commitTagDraft();
      return;
    }

    // Backspace on an already-empty draft pops the most recently committed
    // tag, matching the standard chip-input convention (e.g. Gmail's To
    // field) — otherwise deleting a tag right after typing it requires
    // reaching for the mouse.
    if (event.key === "Backspace" && tagDraft === "" && tags.length > 0) {
      event.preventDefault();
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // Re-opens a committed tag for editing: pulls it back into the draft
  // input (focused) instead of just deleting it, so fixing a typo doesn't
  // mean retyping the whole tag from scratch.
  const editTag = (tag: string) => {
    removeTag(tag);
    setTagDraft(tag);
    focusTagDraftRef.current = true;
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
              <span key={tag} className="pill flex flex-row items-center gap-1">
                <button
                  type="button"
                  onClick={() => editTag(tag)}
                  className="hover:text-primary transition-colors"
                >
                  #{tag.toLowerCase().replace(/[^a-z0-9]/g, "")}
                </button>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="hover:text-primary transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length < MAX_TAGS && (
              <input
                ref={tagDraftInputRef}
                type="text"
                aria-label="Add tags"
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={handleTagDraftKeyDown}
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
