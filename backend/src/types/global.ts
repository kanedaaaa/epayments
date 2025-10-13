import type { Request } from "express";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  webhookUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateData {
  name?: string;
  webhookUrl?: string;
  isActive?: boolean;
}

export interface AuthRequest extends Request {
  merchantId?: string;
}
