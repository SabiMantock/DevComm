import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { slugify } from "@/lib/db-helpers";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// Talks to Postgres via the pg driver adapter (see lib/prisma.ts), which
// needs real TCP sockets — must run on the Node.js runtime, not edge.
export const runtime = "nodejs";

const MAX_TAGS = 4;

// Only the author fields the post views need are selected — `include: {
// author: true }` would also expose the author's email and Clerk id, which
// don't belong in a public API response (same reasoning as
// app/api/projects/[slug]/route.ts's owner selection).
const postWithAuthorArgs = {
  include: {
    author: {
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    },
  },
} satisfies Prisma.PostDefaultArgs;

type PostWithAuthor = Prisma.PostGetPayload<typeof postWithAuthorArgs>;

/**
 * Derives a unique slug for a new post from its title, appending -2, -3,
 * etc. on collision. Post.slug is @unique in the schema, and titles aren't,
 * so two posts titled the same thing need distinct slugs.
 */
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (await prisma.post.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

/**
 * Parses the `tags` form field, which the client sends as a JSON-encoded
 * array of strings (multipart/form-data has no native array type). Returns
 * `null` if the field is present but malformed, so the caller can 400.
 */
function parseTags(raw: FormDataEntryValue | null): string[] | null {
  if (raw === null) return [];
  if (typeof raw !== "string") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed) || parsed.length > MAX_TAGS) return null;
  if (!parsed.every((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)) return null;

  return parsed.map((tag) => tag.trim());
}

/**
 * Uploads a cover image to Cloudinary via upload_stream, promisified since
 * the SDK's stream API is callback-based.
 */
function uploadCoverImage(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "devcomm/posts" },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed with no result."));
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "You must be signed in to create a post." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Expected multipart/form-data." }, { status: 400 });
  }

  const titleRaw = formData.get("title");
  const bodyRaw = formData.get("body");
  const projectIdRaw = formData.get("projectId");
  const image = formData.get("image");

  const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
  if (!title) {
    return NextResponse.json({ message: "A post title is required." }, { status: 400 });
  }

  const body = typeof bodyRaw === "string" ? bodyRaw.trim() : "";
  if (!body) {
    return NextResponse.json({ message: "Post content is required." }, { status: 400 });
  }

  const tags = parseTags(formData.get("tags"));
  if (tags === null) {
    return NextResponse.json({ message: `Tags must be a list of up to ${MAX_TAGS} non-empty strings.` }, { status: 400 });
  }

  let projectId: string | null = null;
  if (typeof projectIdRaw === "string" && projectIdRaw.trim().length > 0) {
    const project = await prisma.project.findUnique({ where: { id: projectIdRaw }, select: { id: true } });
    if (!project) {
      return NextResponse.json({ message: "The linked project could not be found." }, { status: 400 });
    }
    projectId = project.id;
  }

  let coverImageUrl: string | undefined;
  if (image instanceof File) {
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ message: "Cover image must be an image file." }, { status: 400 });
    }

    cloudinary.config();
    try {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploaded = await uploadCoverImage(buffer);
      coverImageUrl = uploaded.secure_url;
    } catch (error) {
      console.error("Cover image upload failed:", error);
      return NextResponse.json({ message: "Failed to upload the cover image." }, { status: 500 });
    }
  }

  let post: PostWithAuthor;
  try {
    post = await prisma.post.create({
      data: {
        authorId: user.id,
        title,
        slug: await uniqueSlug(title),
        body,
        tags,
        coverImageUrl,
        publishedAt: new Date(),
        projectId,
      },
      ...postWithAuthorArgs,
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ message: "Something went wrong while creating the post." }, { status: 500 });
  }

  return NextResponse.json({ message: "Post created.", post }, { status: 201 });
}
