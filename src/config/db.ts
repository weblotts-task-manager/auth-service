import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { MONGO_URI } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    logger.http(`MongoDB connected: ${conn.connection.host}`);
  } catch (e: any) {
    logger.warn(`MongoDB connection error: ${e}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};

export const dropAllCollections = async () => {
  try {
    await mongoose.connection.db?.dropDatabase();
    logger.warn("Database was successfully dropped");
  } catch (error) {
    logger.error("Error dropping databases");
  }
};
