import { NextFunction, Request, Response } from "express";
import { createUserLocation } from "../services/location.service";
import { logger } from "../utils/logger";

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await createUserLocation(req.body);
    logger.info(`Location added:`, response);
    res.end();
  } catch (e: any) {
    logger.error(`Unable to add location: `, e);
    next(e);
  }
};
