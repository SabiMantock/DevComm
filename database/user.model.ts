import { Schema, model, models, Model, Document } from "mongoose";

// Document shape for a User. No password field: auth is Google OAuth only,
// so there's nothing to hash or verify locally.
export interface IUser extends Document {
  googleId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema<IUser>(
  {
    // The `sub` claim from Google's OAuth profile. This is the real identity
    // anchor for the account — unlike `email`/`username`, Google guarantees
    // it never changes for the lifetime of the account, so it's what
    // authentication should key off, not email or username.
    googleId: {
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
    // Populated from Google's profile picture at signup; not guaranteed to
    // exist for every account.
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({ googleId: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Reuse the existing compiled model in dev (Next.js hot-reload re-runs this
// module), otherwise Mongoose throws on redefining the same model.
export const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
