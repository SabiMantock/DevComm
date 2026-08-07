import { Schema, model, models, Model, Document, Types } from "mongoose";
import { Post } from "./post.model";
import { Project } from "./project.model";

// Embedded reply subdocument. Replies are always fetched and rendered
// together with their parent comment and never queried on their own, so
// they live as a subdocument array on Comment rather than their own
// collection.
export interface IReply {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  body: string;
  createdAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Document shape for a Comment. Comments are polymorphic: they attach to
// either a Post or a Project, both of which share the same comment UI.
export interface IComment extends Document {
  authorId: Types.ObjectId;
  parentType: "Post" | "Project";
  parentId: Types.ObjectId;
  body: string;
  replies: Types.DocumentArray<IReply>;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentType: {
      type: String,
      enum: ["Post", "Project"],
      required: true,
    },
    // `refPath` tells Mongoose to resolve this reference against whichever
    // model `parentType` names, so `.populate("parentId")` works for either
    // a Post or a Project parent.
    parentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "parentType",
    },
    body: {
      type: String,
      required: true,
    },
    replies: {
      type: [replySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Defensively verify the polymorphic parent actually exists before saving,
// the same way a `ref` foreign key would be checked if Mongoose enforced
// referential integrity for us.
commentSchema.pre("save", async function () {
  if (this.isNew || this.isModified("parentId") || this.isModified("parentType")) {
    const parentExists =
      this.parentType === "Post"
        ? await Post.exists({ _id: this.parentId })
        : await Project.exists({ _id: this.parentId });
    if (!parentExists) {
      throw new Error(`${this.parentType} with id ${this.parentId} does not exist.`);
    }
  }
});

commentSchema.index({ parentId: 1 });

export const Comment: Model<IComment> = models.Comment || model<IComment>("Comment", commentSchema);
