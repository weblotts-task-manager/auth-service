import mongoose, { Document, model, Schema } from "mongoose";

export interface ILocation extends Document {
  name?: string;
  coordinates?: { lat: number; lng: number };
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  profile?: mongoose.Types.ObjectId;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Location = model<ILocation>("Location", LocationSchema);
