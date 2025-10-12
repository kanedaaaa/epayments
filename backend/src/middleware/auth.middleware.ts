import type { Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";
import merchantService from "../services/merchant.service.js";
import type { AuthRequest } from "../types/global.js";

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header is required", 401);
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AppError("Invalid authorization header format", 401);
    }

    const token = parts[1]!;
    const decoded = merchantService.verifyAccessToken(token);

    req.merchantId = decoded.merchantId;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        const token = parts[1]!;
        const decoded = merchantService.verifyAccessToken(token);
        req.merchantId = decoded.merchantId;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without setting merchantId
    next();
  }
};
