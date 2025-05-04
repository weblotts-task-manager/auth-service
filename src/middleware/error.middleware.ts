import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  logger.error(`Unexpected error: ${err.message}`, {
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "An unexpected error occurred";

  res.status(500).json({
    error: {
      message: message || "Internal Server Error",
      statusCode: 500,
    },
  });
};
