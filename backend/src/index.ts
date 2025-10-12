import express from "express";
import type { Request, Response } from "express";
import * as dotenv from "dotenv";
import merchantRouter from "./routers/merchant.router.js";

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
