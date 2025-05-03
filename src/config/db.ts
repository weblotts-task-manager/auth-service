import mongoose from "mongoose";
import { MONGO_URI } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (e: any) {
    console.log("MongoDB connection error: ", e);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
