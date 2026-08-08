import { auth } from "@clerk/nextjs/server";

import prisma from "./prisma";
import type { User } from "@/generated/prisma/client";

/**
 * Resolves the Prisma `User` row for the currently signed-in Clerk session,
 * or `null` if the request is unauthenticated.
 *
 * Note: a signed-in Clerk session can still resolve to `null` here if the
 * Clerk -> Postgres sync hasn't happened yet for that account (see
 * app/api/webhooks/clerk/route.ts) — callers should treat that the same as
 * "not signed in" rather than assuming a Clerk session guarantees a User
 * row exists.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  return prisma.user.findUnique({ where: { clerkId } });
}
