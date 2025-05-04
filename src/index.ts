import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";

dotenv.config({ path: __dirname + "/.env" });
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  });
});

const PORT = process.env.PORT || 5002;

(async (port) => {
  await connectDB();
  app.listen(port, () => console.log(`Auth Service running on port ${PORT}`));
})(PORT);
