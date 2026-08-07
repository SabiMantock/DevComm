import { Schema, model, models, Model, Document } from "mongoose";

// Document shape for a User. No password field: auth is handled by Clerk,
// so there's nothing to hash or verify locally.
export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema<IUser>(
  {
    // Clerk's own user id for the account. This is the real identity anchor
    // — it's provider-agnostic (stable no matter which sign-in method the
    // user goes through via Clerk) and unlike `email`/`username`, it never
    // changes, so it's what authentication should key off, not email or
    // username.
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: (props: { value: string }) => `${props.value} is not a valid email address.`,
      },
    },
    // Populated from Clerk's profile image at signup; not guaranteed to
    // exist for every account.
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({ clerkId: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Reuse the existing compiled model in dev (Next.js hot-reload re-runs this
// module), otherwise Mongoose throws on redefining the same model.
export const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
