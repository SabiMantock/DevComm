import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/webhooks";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/database";

// This route only touches Mongoose and Node's crypto (via svix), neither of
// which run on the edge runtime.
export const runtime = "nodejs";

/**
 * Narrows an unknown thrown value down to a Mongo duplicate-key error
 * (E11000), without resorting to `any`.
 */
function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
}

/**
 * Derives a fallback username from the local part of an email address, for
 * accounts Clerk didn't assign a `username` to (e.g. email/OAuth sign-ups
 * that don't collect one).
 */
function usernameFromEmail(email: string): string {
  return email.split("@")[0];
}

export async function POST(request: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set.");
    return Response.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  // Svix signs the raw request body, so it must be verified before parsing
  // it as JSON.
  const payload = await request.text();

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "Missing Svix signature headers." }, { status: 400 });
  }

  const webhook = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    // `verify` returns `unknown`; the cast is safe because a successful
    // verification guarantees the payload matches what Clerk sent.
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return Response.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created": {
        const { data } = event;
        const email = data.email_addresses[0]?.email_address;
        if (!email) {
          return Response.json({ error: "Webhook payload is missing an email address." }, { status: 400 });
        }

        await connectToDatabase();
        try {
          await User.create({
            clerkId: data.id,
            username: data.username ?? usernameFromEmail(email),
            email,
            avatarUrl: data.image_url,
          });
        } catch (error) {
          if (isDuplicateKeyError(error)) {
            // Clerk can redeliver the same event; a duplicate `clerkId`
            // means we've already synced this user, so treat it as
            // success rather than an error.
            return Response.json({ received: true }, { status: 200 });
          }
          throw error;
        }
        return Response.json({ received: true }, { status: 200 });
      }

      case "user.updated": {
        const { data } = event;
        const email = data.email_addresses[0]?.email_address;
        if (!email) {
          return Response.json({ error: "Webhook payload is missing an email address." }, { status: 400 });
        }

        await connectToDatabase();
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            username: data.username ?? usernameFromEmail(email),
            email,
            avatarUrl: data.image_url,
          }
        );
        // Silently succeeds even if no matching user was found (e.g. an
        // update for a user created before this webhook existed) — there's
        // nothing to sync, and it isn't a payload/signature problem.
        return Response.json({ received: true }, { status: 200 });
      }

      case "user.deleted": {
        const { data } = event;
        if (!data.id) {
          return Response.json({ error: "Webhook payload is missing a user id." }, { status: 400 });
        }

        await connectToDatabase();
        await User.deleteOne({ clerkId: data.id });
        return Response.json({ received: true }, { status: 200 });
      }

      default:
        // Any other event type this endpoint isn't set up to handle is
        // intentionally ignored, not an error.
        return Response.json({ received: true, ignored: event.type }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to process Clerk webhook:", error);
    return Response.json({ error: "Failed to process webhook." }, { status: 500 });
  }
}
