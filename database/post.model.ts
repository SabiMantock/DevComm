import { Schema, model, models, Model, Document, Types } from "mongoose";

// Document shape for a Post. `projectId` references the future `Project`
// model by collection name ("Project") — typed now so this schema doesn't
// need to change once that model lands.
export interface IPost extends Document {
  authorId: Types.ObjectId;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  coverImageUrl?: string;
  publishedAt: Date;
  projectId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Auto-generated from `title` in the pre-save hook below; never set
    // directly.
    slug: {
      type: String,
      unique: true,
    },
    // HTML from the app's rich text editor.
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "A post requires at least one tag.",
      },
    },
    coverImageUrl: {
      type: String,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

// Regenerate the slug only when `title` changes, so edits to other fields
// don't shift a post's URL out from under existing links/bookmarks.
postSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ authorId: 1 });
// Multikey index on `tags` — Mongo indexes each array element individually,
// which is what makes filtering/searching posts by tag efficient.
postSchema.index({ tags: 1 });

export const Post: Model<IPost> = models.Post || model<IPost>("Post", postSchema);
