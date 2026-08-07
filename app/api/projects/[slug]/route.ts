import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// This route talks to Postgres via the pg driver adapter (see lib/prisma.ts),
// which needs real TCP sockets — it must run on the Node.js runtime, not edge.
export const runtime = "nodejs";

// A project matches what slugify() (lib/db-helpers.ts) produces when the
// slug was generated: lowercase alphanumeric segments separated by single
// hyphens, no leading/trailing hyphen.
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Only the owner fields the project detail view actually needs are
// selected — `include: { owner: true }` would also expose the owner's
// email and Clerk id, neither of which belongs in a public API response.
const projectWithOwnerArgs = {
  include: {
    owner: {
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    },
  },
} satisfies Prisma.ProjectDefaultArgs;

type ProjectWithOwner = Prisma.ProjectGetPayload<typeof projectWithOwnerArgs>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    return NextResponse.json({ error: "A project slug is required." }, { status: 400 });
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "The provided slug is not valid." }, { status: 400 });
  }

  let project: ProjectWithOwner | null;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
      ...projectWithOwnerArgs,
    });
  } catch (error) {
    // Log the real error server-side, but never leak internals (query
    // details, connection info, stack traces) back to the client.
    console.error(`GET /api/projects/${slug} failed:`, error);
    return NextResponse.json(
      { error: "Something went wrong while fetching the project." },
      { status: 500 }
    );
  }

  if (!project) {
    return NextResponse.json({ error: `No project found for slug "${slug}".` }, { status: 404 });
  }

  return NextResponse.json(project, { status: 200 });
}
