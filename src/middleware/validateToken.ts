import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
