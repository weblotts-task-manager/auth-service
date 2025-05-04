import { ForbiddenError, UnauthorizedError } from "../errors/appError";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  // check if user exist
  if (await User.findOne({ email })) {
    // throw new Error("Email already in use");
    throw new ForbiddenError("Email already in use");
  }
  //create user
  const user = await User.create({ email, password, name });

  // generate verification code
  const verificationCode = generateAccessToken({
    userId: user._id as string,
    email: user.email,
  });
  // await EmailService.sendVerificationEmail(user.email, verificationToken);

  return user;
};

export const loginUser = async (
  email: string,
  password: string,
  refreshTokenObj: any
) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    // throw new Error("Invalid email or password");
    throw new UnauthorizedError("Invalid email or password...");
  }

  if (!user.isVerified) {
    // throw new Error("Please verify your email first");
    throw new UnauthorizedError("Please verify your email first");
  }

  const accessToken = generateAccessToken({
    userId: user._id as string,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id as string,
    email: user.email,
  });

  // store refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Token.create({
    userId: user._id,
    token: refreshToken,
    ipAddress: refreshTokenObj.ipAddress,
    userAgent: refreshTokenObj.userAgent,
    expiresAt,
  });

  return { accessToken, refreshToken, user };
};

export const refreshToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const storedToken = await Token.findOne({
    userId: payload.userId,
    token: refreshToken,
  });
  if (!storedToken) {
    // throw new Error("Invalid refresh token");
    throw new UnauthorizedError("Invalid refresh token");
  }
  const user = await User.findById(payload.userId);
  const newAccessToken = generateAccessToken(payload);
};

export const logout = async (refreshToken: string) => {
  await Token.findOneAndDelete({ token: refreshToken });
};
