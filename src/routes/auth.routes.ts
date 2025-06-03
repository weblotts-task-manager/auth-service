import express from "express";
import {
  login,
  logoutUser,
  register,
  tokenRefresh,
  verifyEmail,
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/refresh-token", tokenRefresh);
authRoutes.get("/verify-email", verifyEmail);

export default authRoutes;
