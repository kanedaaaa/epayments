import { Router } from "express";
import type { Response, Router as RouterType } from "express";
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

router.post("/signup", async (req: AuthRequest, res: Response) => {
  try {
    const data: SignupData = req.body;
    const result = await merchantService.signup(data);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.post("/login", async (req: AuthRequest, res: Response) => {
  try {
    const data: LoginData = req.body;
    const result = await merchantService.login(data);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.post("/refresh", async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }
    const tokens = await merchantService.refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.post("/logout", async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }
    await merchantService.revokeRefreshToken(refreshToken);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get("/me", authenticateJWT, async (req: AuthRequest, res: Response) => {
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
    if (error instanceof AppError) {
      res.status(error.errorCode).json({ error: error.clientError });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.patch(
  "/me",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.merchantId) {
        throw new AppError("Unauthorized", 401);
      }
      const data: UpdateData = req.body;
      const merchant = await merchantService.update(req.merchantId, data);
      res.status(200).json(merchant);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.errorCode).json({ error: error.clientError });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
);

export default router;
