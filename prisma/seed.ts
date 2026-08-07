import "dotenv/config";

import { prisma } from "../lib/prisma";
import { slugify } from "../lib/db-helpers";

// A handful of rows to sanity-check the schema end to end. Not meant to
// resemble real DevComm content — swap out or extend as needed.
async function main() {
  const ada = await prisma.user.upsert({
    where: { clerkId: "seed_user_ada" },
    update: {},
    create: {
      clerkId: "seed_user_ada",
      username: "ada",
      email: "ada@example.com",
      avatarUrl: "https://avatars.example.com/ada.png",
    },
  });

  const grace = await prisma.user.upsert({
    where: { clerkId: "seed_user_grace" },
    update: {},
    create: {
      clerkId: "seed_user_grace",
      username: "grace",
      email: "grace@example.com",
    },
  });

  const projectTitle = "DevComm Seed Project";
  const project = await prisma.project.upsert({
    where: { slug: slugify(projectTitle) },
    update: {},
    create: {
      ownerId: ada.id,
      title: projectTitle,
      slug: slugify(projectTitle),
      description: "A seeded project used to verify the Prisma schema.",
      stack: ["TypeScript", "Next.js", "Prisma"],
      type: "WEB_APP",
      status: "WIP",
      repoUrl: "https://github.com/example/devcomm-seed",
    },
  });

  const postTitle = "Hello, Prisma Postgres";
  const post = await prisma.post.upsert({
    where: { slug: slugify(postTitle) },
    update: {},
    create: {
      authorId: ada.id,
      title: postTitle,
      slug: slugify(postTitle),
      body: "<p>This post was created by prisma/seed.ts.</p>",
      tags: ["prisma", "postgres", "seed"],
      publishedAt: new Date(),
      projectId: project.id,
    },
  });

  const comment = await prisma.comment.upsert({
    where: { id: "seed_comment_1" },
    update: {},
    create: {
      id: "seed_comment_1",
      authorId: grace.id,
      parentType: "Post",
      parentId: post.id,
      body: "Nice, migration worked!",
    },
  });

  await prisma.reply.upsert({
    where: { id: "seed_reply_1" },
    update: {},
    create: {
      id: "seed_reply_1",
      commentId: comment.id,
      authorId: ada.id,
      body: "Thanks for checking it out.",
    },
  });

  await prisma.like.upsert({
    where: {
      userId_likeableType_likeableId: {
        userId: grace.id,
        likeableType: "Post",
        likeableId: post.id,
      },
    },
    update: {},
    create: {
      userId: grace.id,
      likeableType: "Post",
      likeableId: post.id,
    },
  });

  await prisma.bookmark.upsert({
    where: { userId_postId: { userId: grace.id, postId: post.id } },
    update: {},
    create: {
      userId: grace.id,
      postId: post.id,
      status: "saved",
    },
  });

  console.log("Seeded:", {
    users: [ada.username, grace.username],
    project: project.slug,
    post: post.slug,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
