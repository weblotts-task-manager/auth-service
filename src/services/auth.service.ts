import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const registerUser = async (email: string, password: string) => {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("User already exists");
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ email, password: hashed });
  const user = await newUser.save();
  return { user, token: generateToken(user._id as string) };
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return { user, token: generateToken(user._id as string) };
};
