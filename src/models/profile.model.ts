import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: mongoose.Types.ObjectId;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProfile: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    bio: { type: String, trim: true },
    avatar: { type: String, trim: true },
    website: { type: String, trim: true },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
      unique: false,
    },
    socialMedia: {
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
    },
  },
  { timestamps: true }
);
//query faster
UserProfile.index({ user: 1 });
//prevent user duplication of same profile
UserProfile.index({ user: 1 }, { unique: true });

export const Profile = mongoose.model<IUserProfile>("Profile", UserProfile);
