import { Router } from "express";
import type { Response, NextFunction, Router as RouterType } from "express";
import apiKeyService from "../services/apiKey.service.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import type { AuthRequest } from "../types/global.js";
import { AppError } from "../lib/AppError.js";

const router: RouterType = Router();

// All routes require JWT authentication (dashboard only)
router.use(authenticateJWT);

// Generate a new API key
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { name } = req.body;
    const result = await apiKeyService.generateApiKey(req.merchantId, name);
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Get all API keys for the authenticated merchant
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const apiKeys = await apiKeyService.getApiKeys(req.merchantId);
    res.status(200).json(apiKeys);
  } catch (error) {
    next(error);
  }
});

// Get a specific API key by ID
router.get("/:keyId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { keyId } = req.params;
    if (!keyId) {
      throw new AppError("API key ID is required", 400);
    }
    const apiKey = await apiKeyService.getApiKeyById(req.merchantId, keyId);
    
    if (!apiKey) {
      throw new AppError("API key not found", 404);
    }

    res.status(200).json(apiKey);
  } catch (error) {
    next(error);
  }
});

// Update an API key (name, expiration)
router.patch("/:keyId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { keyId } = req.params;
    if (!keyId) {
      throw new AppError("API key ID is required", 400);
    }
    const { name, expiresAt } = req.body;

    const apiKey = await apiKeyService.updateApiKey(req.merchantId, keyId, {
      name,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(200).json(apiKey);
  } catch (error) {
    next(error);
  }
});

// Revoke an API key
router.delete("/:keyId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { keyId } = req.params;
    if (!keyId) {
      throw new AppError("API key ID is required", 400);
    }
    await apiKeyService.revokeApiKey(req.merchantId, keyId);

    res.status(200).json({ message: "API key revoked successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
