import { NextFunction, Request, Response } from "express";
import { toUserDTO } from "../dto/toUserDto";
import { loginUser, registerUser } from "../services/auth.service";
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
    res.status(201).json({ message: "User registered successfully", user });
  } catch (e: any) {
    // res.status(400).json({ message: e.message });
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
    // const user = await toUserDTO(userObj);
    logger.info(`User logged in: ${email} `);
    res.status(200).json({ message: "Login successful", user });
  } catch (e: any) {
    logger.error(`Login error ${e.message}`);
    // res.status(400).json({ error: e.message });
    next(e);
  }
};
