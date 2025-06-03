import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../errors/appError";
import { IUserProfile } from "../models/profile.model";
import {
  createProfile,
  deleteProfile,
  getProfileById,
  updateProfile,
} from "../services/user.service";
import { verifyAccessToken } from "../utils/jwt";
import { logger } from "../utils/logger";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Authorization token is missing");
    }
    const payload = verifyAccessToken(token);
    const { userId } = payload;
    const profile = await getProfileById(userId);

    if (!profile) {
      throw new NotFoundError("User profile not found");
    }
    res.status(200).json(profile);
  } catch (e: any) {
    logger.error(`Login error: ${e.message}`);
    next(e);
  }
};

export const createOrUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Authorization token is missing");
    }
    const payload = verifyAccessToken(token);
    const { userId } = payload;

    const existingProfile = await getProfileById(userId);
    let profile: IUserProfile | null;
    if (existingProfile) {
      profile = await updateProfile(userId, req.body);
    } else {
      profile = await createProfile(userId, req.body);
    }
    res.status(200).json(profile);
  } catch (e: any) {
    logger.error(`Error adding or updating profile: ${e.message}`);
    next(e);
  }
};

export const deleteUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Authorization token is missing");
    }
    const payload = verifyAccessToken(token);
    const { userId } = payload;
    await deleteProfile(userId);
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (e: any) {
    logger.error(`Profile not deleted: ${e.message}`);
    next(e);
  }
};
