import express from "express";
import type { Request, Response } from "express";
import * as dotenv from "dotenv";
import merchantRouter from "./routers/merchant.router.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to ePayment API" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/merchants", merchantRouter);

// Error handler (must be registered AFTER all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
