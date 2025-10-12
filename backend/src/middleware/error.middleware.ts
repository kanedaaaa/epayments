import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.errorCode).json({ error: error.clientError });
  } else {
    console.error("Unhandled error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
