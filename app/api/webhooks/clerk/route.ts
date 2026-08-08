import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/db-helpers";
import { Prisma } from "@/generated/prisma/client";

// This route talks to Postgres via the pg driver adapter (see lib/prisma.ts),
// which needs real TCP sockets — it must run on the Node.js runtime, not edge.
export const runtime = "nodejs";

/**
 * Derives a fallback username from the local part of an email address, for
 * accounts Clerk didn't assign a `username` to (e.g. email/OAuth sign-ups
 * that don't collect one).
 */
function usernameFromEmail(email: string): string {
  return email.split("@")[0];
}

/**
 * Narrows an unknown thrown value down to a specific Prisma known-request
 * error code, without resorting to `any`.
 */
function isPrismaErrorWithCode(error: unknown, code: string): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // verifyWebhook (from @clerk/nextjs/webhooks) verifies the Standard
  // Webhooks signature against CLERK_WEBHOOK_SIGNING_SECRET and returns the
  // parsed, typed event — this replaces manually calling svix's Webhook
  // class, which this Clerk version no longer depends on.
  let event;
  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook signature verification failed:", error);
    return NextResponse.json({ message: "Webhook signature verification failed." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created": {
        const { data } = event;
        const email = data.email_addresses[0]?.email_address;
        if (!email || !isValidEmail(email)) {
          return NextResponse.json(
            { message: "Webhook payload is missing a valid email address." },
            { status: 400 }
          );
        }

        try {
          await prisma.user.create({
            data: {
              clerkId: data.id,
              username: data.username ?? usernameFromEmail(email),
              email,
              avatarUrl: data.image_url,
            },
          });
        } catch (error) {
          if (isPrismaErrorWithCode(error, "P2002")) {
            // Clerk can redeliver the same event; a duplicate clerkId means
            // we've already synced this user, so treat it as success rather
            // than an error.
            return NextResponse.json({ message: "User already synced." }, { status: 200 });
          }
          throw error;
        }
        return NextResponse.json({ message: "User created." }, { status: 200 });
      }

      case "user.updated": {
        const { data } = event;
        const email = data.email_addresses[0]?.email_address;
        if (!email || !isValidEmail(email)) {
          return NextResponse.json(
            { message: "Webhook payload is missing a valid email address." },
            { status: 400 }
          );
        }

        try {
          await prisma.user.update({
            where: { clerkId: data.id },
            data: {
              username: data.username ?? usernameFromEmail(email),
              email,
              avatarUrl: data.image_url,
            },
          });
        } catch (error) {
          if (isPrismaErrorWithCode(error, "P2025")) {
            // No matching user (e.g. an update for a user created before
            // this webhook existed) — nothing to sync, not a failure.
            return NextResponse.json({ message: "No matching user to update." }, { status: 200 });
          }
          throw error;
        }
        return NextResponse.json({ message: "User updated." }, { status: 200 });
      }

      case "user.deleted": {
        const { data } = event;
        if (!data.id) {
          return NextResponse.json({ message: "Webhook payload is missing a user id." }, { status: 400 });
        }

        try {
          await prisma.user.delete({ where: { clerkId: data.id } });
        } catch (error) {
          if (isPrismaErrorWithCode(error, "P2025")) {
            return NextResponse.json({ message: "No matching user to delete." }, { status: 200 });
          }
          throw error;
        }
        return NextResponse.json({ message: "User deleted." }, { status: 200 });
      }

      default:
        // Any other event type this endpoint isn't set up to handle is
        // intentionally ignored, not an error.
        return NextResponse.json({ message: `Ignored event type "${event.type}".` }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to process Clerk webhook:", error);
    return NextResponse.json({ message: "Failed to process webhook." }, { status: 500 });
  }
}
