import "dotenv/config";

import { prisma } from "../lib/prisma";

// One read against the database to confirm the Prisma Postgres connection
// (schema, generated client, and driver adapter) is wired up correctly.
async function main() {
  const userCount = await prisma.user.count();
  console.log(`✅ Connected (found ${userCount} user row(s))`);
}

main()
  .catch((error) => {
    console.error("❌ Failed to connect:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
