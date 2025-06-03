import express from "express";
import { createLocation } from "../controllers/location.controller";

const locationRoutes = express.Router();

locationRoutes.route("/").post(createLocation);

export default locationRoutes;
