import { Document, model, Schema, Types } from "mongoose";

export interface IToken extends Document {
  userId: Types.ObjectId;
  token: string;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema: Schema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "0s" },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);
// Index for faster queries by the user and token
tokenSchema.index({ token: 1 }, { unique: true });

/**
 * Static method to create a new token
 */
tokenSchema.statics.createToken = async function (
  userId: Types.ObjectId,
  token: string,
  ipAddress: string,
  userAgent: string,
  expiresAt: Date
) {
  const tokenDoc = await this.create({
    userId,
    token,
    ipAddress,
    userAgent,
    expiresAt,
  });
  return tokenDoc;
};

/**
 * Static method to invalidate tokens for a user
 */
tokenSchema.statics.invalidateAllTokensForUser = async function (
  userId: Types.ObjectId
) {
  return this.updateMany({ userId }, { $set: { isValid: false } });
};

/**
 * Static method to get all valid tokens for a user
 */
tokenSchema.statics.getUserTokens = async function (userId: Types.ObjectId) {
  return this.deleteMany({
    expiresAt: { $gt: new Date() },
  });
};

/**
 * Static method to cleanup expired tokens
 */
tokenSchema.statics.cleanupExpiredTokens = async function () {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};

export const Token = model<IToken>("Token", tokenSchema);
