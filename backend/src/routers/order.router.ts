import { Router } from "express";
import type { Response, NextFunction, Router as RouterType } from "express";
import orderService from "../services/order.service.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import type { AuthRequest } from "../types/global.js";
import { AppError } from "../lib/AppError.js";

const router: RouterType = Router();

// All routes require JWT authentication (dashboard only)
router.use(authenticateJWT);

// Get all orders for the authenticated merchant
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { status } = req.query;
    const orders = await orderService.getOrdersByMerchant(
      req.merchantId,
      status as "pending" | "paid" | "expired" | "failed" | undefined
    );

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// Get a specific order by ID
router.get("/:orderId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }

    const { orderId } = req.params;
    if (!orderId) {
      throw new AppError("Order ID is required", 400);
    }

    const order = await orderService.getOrder(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Verify ownership
    if (order.merchantId !== req.merchantId) {
      throw new AppError("Unauthorized to access this order", 403);
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
