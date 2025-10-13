import { Router } from "express";
import type { Response, NextFunction, Router as RouterType } from "express";
import orderService from "../services/order.service.js";
import { authenticateApiKey } from "../middleware/apiKey.middleware.js";
import type { AuthRequest } from "../types/global.js";
import { AppError } from "../lib/AppError.js";

const router: RouterType = Router();

// All routes require API key authentication (widget/public API)
router.use(authenticateApiKey);

// Create a new order (called by widget)
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { amount, currency, expiresInMinutes } = req.body;

    if (!amount || !currency) {
      throw new AppError("Amount and currency are required", 400);
    }

    const order = await orderService.createOrder(req.merchantId, {
      amount,
      currency,
      expiresInMinutes,
    });

    // Don't expose private key in response
    const { privateKey, ...orderWithoutPrivateKey } = order;

    res.status(201).json(orderWithoutPrivateKey);
  } catch (error) {
    next(error);
  }
});

// Check order status (called by widget to poll for payment)
router.get("/:orderId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new AppError("Order ID is required", 400);
    }

    const order = await orderService.getOrder(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Verify the API key belongs to the merchant who owns this order
    if (order.merchantId !== req.merchantId) {
      throw new AppError("Unauthorized to access this order", 403);
    }

    // Don't expose private key
    const { privateKey, ...orderWithoutPrivateKey } = order;

    res.status(200).json(orderWithoutPrivateKey);
  } catch (error) {
    next(error);
  }
});

export default router;
