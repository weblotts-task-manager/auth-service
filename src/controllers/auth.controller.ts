import { NextFunction, Request, Response } from "express";
import { toUserDTO } from "../dto/toUserDto";
import { NotFoundError, UnauthorizedError } from "../errors/appError";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
  verifyEmailService,
} from "../services/auth.service";
import { logger } from "../utils/logger";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;
    const userObj = await registerUser(email, password, name);

    const user = toUserDTO(userObj);
    res.status(201).json({
      message: "User registered successfully, check your email to continue.",
      user,
    });
  } catch (e: any) {
    logger.error(`Registration error: ${e}`);
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const refreshTokenObj = {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    const user = await loginUser(email, password, refreshTokenObj);
    logger.info(`User logged in: ${email} `);
    res.status(200).json({ message: "Login successful", user });
  } catch (e: any) {
    logger.error(`Login error: ${e.message}`);
    next(e);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedError("No refresh token provided");
    await logout(refreshToken);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (e: any) {
    logger.error("Token error: ", e);
    next(e);
  }
};

export const tokenRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenToBeRefreshed =
      req.body.refreshToken || req.cookies.refreshToken;
    if (!tokenToBeRefreshed)
      throw new NotFoundError("No refresh token was found");
    const { accessToken, refreshToken: newRefreshToken } = await refreshToken(
      tokenToBeRefreshed
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    logger.info(`Refresh token generated: ${newRefreshToken}`);
    res.json({ accessToken });
  } catch (e: any) {
    logger.error("Refresh Token error: ", e);
    next(e);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token as string;
    await verifyEmailService(token);
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (e: any) {
    logger.error("Email not verified: ", e);
    next(e);
  }
};
