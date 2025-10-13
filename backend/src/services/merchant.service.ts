import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { Merchant } from "../generated/prisma/index.js";
import { AppError } from "../lib/AppError.js";
import type { SignupData, LoginData, UpdateData } from "../types/global.js";

class MerchantService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly ACCESS_TOKEN_EXPIRY = "30d";
  private readonly SALT_ROUNDS = 10;

  public async getByID(id: string): Promise<Omit<Merchant, "password"> | null> {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        webhookUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    return merchant;
  }

  public async getByEmail(email: string): Promise<Merchant | null> {
    return await prisma.merchant.findUnique({
      where: { email },
    });
  }

  public async signup(
    data: SignupData
  ): Promise<{ merchant: Omit<Merchant, "password">; accessToken: string }> {
    const existingMerchant = await this.getByEmail(data.email);
    if (existingMerchant) {
      throw new AppError(
        "A merchant with this email already exists",
        409,
        `Duplicate merchant signup attempt: ${data.email}`
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const merchant = await prisma.merchant.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        webhookUrl: data.webhookUrl ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        webhookUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    const accessToken = this.generateAccessToken(merchant.id);

    return { merchant, accessToken };
  }

  public async login(
    data: LoginData
  ): Promise<{ merchant: Omit<Merchant, "password">; accessToken: string }> {
    const merchant = await this.getByEmail(data.email);
    if (!merchant) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!merchant.isActive) {
      throw new AppError(
        "Your account is inactive. Please contact support.",
        403
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      merchant.password
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = this.generateAccessToken(merchant.id);

    const { password, ...merchantWithoutPassword } = merchant;

    return { merchant: merchantWithoutPassword, accessToken };
  }

  public async update(
    id: string,
    data: UpdateData
  ): Promise<Omit<Merchant, "password">> {
    const merchant = await prisma.merchant.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        webhookUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    return merchant;
  }

  private generateAccessToken(merchantId: string): string {
    return jwt.sign({ merchantId }, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }
}

export default new MerchantService();
