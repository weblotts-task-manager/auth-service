import mongoose, { Document, Schema } from "mongoose";
import { compare, hash } from "../utils/crypto";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hash(this.password);
    next();
  } catch (e: any) {
    next(e as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
