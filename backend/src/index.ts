import express from "express";
import type { Request, Response } from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import merchantRouter from "./routers/merchant.router.js";
import apiKeyRouter from "./routers/apiKey.router.js";
import orderRouter from "./routers/order.router.js";
import publicOrderRouter from "./routers/publicOrder.router.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { NETWORK, SUPPORTED_CURRENCIES } from "./config/blockchain.config.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to ePayment API" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    network: NETWORK,
    supportedCurrencies: SUPPORTED_CURRENCIES,
  });
});

// Dashboard Routes (JWT auth)
app.use("/api/merchants", merchantRouter);
app.use("/api/keys", apiKeyRouter);
app.use("/api/orders", orderRouter);

// Widget Routes (API key auth)
app.use("/api/widget/orders", publicOrderRouter);

// Error handler (must be registered AFTER all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
