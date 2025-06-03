import { UpdateQuery } from "mongoose";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/appError";
import { IUserProfile, Profile } from "../models/profile.model";
import { IUser, User } from "../models/user.model";

export const UpdateUser = async (
  userId: string,
  updates: UpdateQuery<IUser>
): Promise<IUser | null> => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return updateUser;
  } catch (error: any) {
    throw new BadRequestError(`Failed to update user: ${error.message}`);
  }
};

export const createProfile = async (
  userId: string,
  profileData: Partial<IUserProfile>
): Promise<IUserProfile> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const existingProfile = await Profile.findOne({ user: userId });
  if (existingProfile) {
    throw new ConflictError("Profile already exists");
  }
  const profile = new Profile({
    user: userId,
    ...profileData,
  });

  return await profile.save();
};

export const getProfileById = async (
  userId: string
): Promise<IUserProfile | null> => {
  return await Profile.findOne({ user: userId })
    .populate("user", "-password")
    .populate("location");
};

export const updateProfile = async (
  userId: string,
  data: Partial<IUserProfile>
): Promise<IUserProfile | null> => {
  return await Profile.findOneAndUpdate(
    { user: userId },
    { $set: data },
    { new: true, runValidators: true }
  ).populate("user", "-password");
};

export const deleteProfile = async (userId: string): Promise<void> => {
  await Profile.findOneAndDelete({ user: userId });
};
