import { Schema, model, models, Model, Document, Types } from "mongoose";

// Document shape for a Bookmark.
export interface IBookmark extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  status: "saved" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    // A bookmark moves between "saved" and "archived" rather than being
    // deleted/recreated, matching the app's existing archive/unarchive flow.
    status: {
      type: String,
      enum: ["saved", "archived"],
      required: true,
      default: "saved",
    },
  },
  { timestamps: true }
);

// A user can only have one bookmark record per post — its `status` moves
// between saved/archived instead of creating duplicate rows.
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const Bookmark: Model<IBookmark> = models.Bookmark || model<IBookmark>("Bookmark", bookmarkSchema);
