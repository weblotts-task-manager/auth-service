import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/appError";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sendVerificationEmail } from "./email.service";

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    // check if user exist
    if (await User.findOne({ email })) {
      throw new ConflictError("Email already in use");
    }
    //create user
    // generate verification code

    const user = await User.create({
      email,
      password,
      name,
    });

    const verificationCode = await generateAccessToken({
      userId: user._id as string,
      email,
    });
    const data = {
      _id: user._id,
      email: user.email,
      verificationToken: verificationCode,
      name: user.name,
    };

    await sendVerificationEmail(data);
    return user;
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
};

export const loginUser = async (
  email: string,
  password: string,
  refreshTokenObj: any
) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (!user.isVerified) {
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
    throw new UnauthorizedError("Invalid refresh token");
  }
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }
  const newAccessToken = generateAccessToken({
    userId: user._id as string,
    email: user.email,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user._id as string,
    email: user.email,
  });

  storedToken.token = newRefreshToken;
  await storedToken.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const verifyEmailService = async (token: string) => {
  try {
    if (!token) throw new BadRequestError("Invalid verification link");
    const user = await User.findOne({ verificationToken: token });
    if (!user)
      throw new BadRequestError("Invalid or expired verification token.");
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return user;
  } catch (error) {
    throw new BadRequestError("Token not valid");
  }
};

export const logout = async (refreshToken: string) => {
  if (!(await Token.findOneAndDelete({ token: refreshToken })))
    throw new NotFoundError("Refresh token not found");
};
