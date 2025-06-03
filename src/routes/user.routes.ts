import express from "express";
import {
  createOrUpdateProfile,
  deleteUserProfile,
  getProfile,
} from "../controllers/user.controller";
const userRoutes = express.Router();

userRoutes
  .route("/profile")
  .get(getProfile)
  .post(createOrUpdateProfile)
  .delete(deleteUserProfile);

export default userRoutes;
