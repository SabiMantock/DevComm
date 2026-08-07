import { Schema, model, models, Model, Document, Types } from "mongoose";

// One generic Like model covers posts, projects, comments, and replies
// instead of four near-identical collections.
export interface ILike extends Document {
  userId: Types.ObjectId;
  likeableType: "Post" | "Project" | "Comment" | "Reply";
  likeableId: Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likeableType: {
      type: String,
      enum: ["Post", "Project", "Comment", "Reply"],
      required: true,
    },
    // No `ref`/`refPath` here: unlike the other three types, a "Reply" like
    // points at a reply subdocument's `_id` *inside* a Comment document —
    // there's no separate Reply collection for Mongoose to resolve against.
    // Looking up a liked reply means querying Comment with
    // `{ "replies._id": likeableId }` instead of `.populate()`.
    likeableId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  }
);

// The unique index — not application logic — is what actually prevents a
// user from double-liking the same thing.
likeSchema.index({ userId: 1, likeableType: 1, likeableId: 1 }, { unique: true });

export const Like: Model<ILike> = models.Like || model<ILike>("Like", likeSchema);
