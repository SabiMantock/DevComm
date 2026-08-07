import prisma from "./prisma";

// Logic that used to live in Mongoose pre-save hooks/validators
// (database/*.model.ts) before the migration to Prisma. Prisma has no
// schema-level hook equivalent, so these are called explicitly from route
// handlers before writing to the database.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address's format. Was a Mongoose custom validator on
 * `User.email`; Prisma has no field-level validator, so callers must run
 * this before creating/updating a User.
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Derives a URL-safe slug from a title. Was regenerated automatically in a
 * Mongoose pre-save hook whenever `title` changed (for Post and Project);
 * callers must now call this themselves and only when the title actually
 * changed, so edits to other fields don't shift a document's URL out from
 * under existing links/bookmarks.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Verifies a Comment's polymorphic parent (a Post or a Project) actually
 * exists before the comment is created. Was a Mongoose pre-save hook on
 * Comment; Prisma/MongoDB can't express a relation that targets either of
 * two different models, so this check moves here.
 */
export async function assertParentExists(parentType: "Post" | "Project", parentId: string): Promise<boolean> {
  if (parentType === "Post") {
    const post = await prisma.post.findUnique({ where: { id: parentId }, select: { id: true } });
    return post !== null;
  }
  const project = await prisma.project.findUnique({ where: { id: parentId }, select: { id: true } });
  return project !== null;
}
