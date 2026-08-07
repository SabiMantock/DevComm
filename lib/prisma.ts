import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Next.js dev mode clears the Node module cache on every file change (fast
// refresh), which would normally re-run this module and instantiate a new
// PrismaClient — and a new underlying connection pool — on each edit.
// Stashing the instance on `globalThis` survives that module reload, so we
// reuse the same client instead of piling up new connections against
// Postgres. Same reasoning as the cached-connection pattern the previous
// Mongoose setup (lib/mongodb.ts) used.
declare global {
  var prismaClient: PrismaClient | undefined;
}

// Prisma 7 requires an explicit driver adapter — there's no bundled Rust
// query engine to fall back to. `@prisma/adapter-pg` wraps the plain `pg`
// driver.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma: PrismaClient = global.prismaClient ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prismaClient = prisma;
}

export default prisma;
