import { Schema, model, models, Model, Document, Types } from "mongoose";

// Document shape for a Project.
export interface IProject extends Document {
  ownerId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  writeUp?: string;
  stack: string[];
  type: "Web app" | "Tool" | "Game" | "Script";
  status: "WIP" | "Shipped";
  liveUrl?: string;
  repoUrl?: string;
  coverImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    ownerId: {
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
    // Short summary shown on the project card.
    description: {
      type: String,
      required: true,
    },
    // Longer optional HTML from the rich text editor, shown on the detail page.
    writeUp: {
      type: String,
    },
    stack: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "A project requires at least one stack entry.",
      },
    },
    // Fixed set of project categories used for filtering.
    type: {
      type: String,
      enum: ["Web app", "Tool", "Game", "Script"],
      required: true,
    },
    // Fixed set of build states used for filtering.
    status: {
      type: String,
      enum: ["WIP", "Shipped"],
      required: true,
    },
    liveUrl: {
      type: String,
    },
    repoUrl: {
      type: String,
    },
    coverImageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Same slug pattern as Post: regenerate only when `title` changes, so edits
// to other fields don't shift a project's URL out from under existing links.
projectSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ ownerId: 1 });

export const Project: Model<IProject> = models.Project || model<IProject>("Project", projectSchema);
