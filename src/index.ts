import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import { logger } from "./utils/logger";

dotenv.config({ path: __dirname + "/.env" });
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5002;

(async (port) => {
  await connectDB();
  app.listen(port, () =>
    logger.http(`Authentication server started on port: ${port}`)
  );
})(PORT);
