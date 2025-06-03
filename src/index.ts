import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import locationRoutes from "./routes/location.routes";
import userRoutes from "./routes/user.routes";
import { logger } from "./utils/logger";

dotenv.config({ path: __dirname + "/.env" });
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // e.g. Vite dev server
    credentials: true, // if you're using cookies or auth headers
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth/user", userRoutes);
app.use("/api/auth/location", locationRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5002;

(async (port) => {
  await connectDB();
  // await dropAllCollections();
  app.listen(port, () =>
    logger.http(`Authentication server started on port: ${port}`)
  );
})(PORT);
