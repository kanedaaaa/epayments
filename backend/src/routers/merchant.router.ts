import { Router } from "express";
import type { Response, NextFunction, Router as RouterType } from "express";
import merchantService from "../services/merchant.service.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import type {
  AuthRequest,
  SignupData,
  LoginData,
  UpdateData,
} from "../types/global.js";
import { AppError } from "../lib/AppError.js";

const router: RouterType = Router();

router.post("/signup", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: SignupData = req.body;
    const result = await merchantService.signup(data);
    
    // Set JWT in httpOnly cookie
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    // Return merchant data without token
    res.status(201).json({ merchant: result.merchant });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: LoginData = req.body;
    const result = await merchantService.login(data);
    
    // Set JWT in httpOnly cookie
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    // Return merchant data without token
    res.status(200).json({ merchant: result.merchant });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authenticateJWT, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.merchantId) {
      throw new AppError("Unauthorized", 401);
    }
    const merchant = await merchantService.getByID(req.merchantId);
    if (!merchant) {
      throw new AppError("Merchant not found", 404);
    }
    res.status(200).json(merchant);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/me",
  authenticateJWT,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.merchantId) {
        throw new AppError("Unauthorized", 401);
      }
      const data: UpdateData = req.body;
      const merchant = await merchantService.update(req.merchantId, data);
      res.status(200).json(merchant);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/logout", (_req: AuthRequest, res: Response) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
