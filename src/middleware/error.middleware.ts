import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: Error | AppError | any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // Log unexpected errors
  logger.error(`Unexpected error: ${err.message}`, {
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // console.log(err);

  // Don't leak error details in production
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "An unexpected error occurred";
  const statusCode = err.statusCode || 500;
  // const message = err.message;
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
};
