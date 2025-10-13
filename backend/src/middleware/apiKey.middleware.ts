import type { Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";
import apiKeyService from "../services/apiKey.service.js";
import type { AuthRequest } from "../types/global.js";

export const authenticateApiKey = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      throw new AppError("API key is required", 401);
    }

    // Validate API key and get merchant info
    const apiKeyData = await apiKeyService.validateApiKey(apiKey);

    // Set merchantId in request for downstream use
    req.merchantId = apiKeyData.merchantId;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(401).json({ error: "Invalid API key" });
    }
  }
};
