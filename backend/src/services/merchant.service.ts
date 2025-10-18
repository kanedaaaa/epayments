import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { Merchant } from "../generated/prisma/index.js";
import { AppError } from "../lib/AppError.js";
import type { SignupData, LoginData, UpdateData } from "../types/global.js";
import crypto from "crypto";
import { redis } from "../lib/redis.js";

class MerchantService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly ACCESS_TOKEN_EXPIRY = "30d";
  private readonly SALT_ROUNDS = 10;
  private readonly RESET_TOKEN_EXPIRY = 3600; // hour
  private readonly RESET_TOKEN_PREFIX = "reset_token:";

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

  // 2 FUNCTIONS BELOW ARE WIP

  public async requestPasswordReset(email: string): Promise<string> {
    const merchant = await this.getByEmail(email);

    if (!merchant) {
      crypto.randomBytes(32).toString("hex"); // still generate a token  to prevent timing attacks
      return "reset_requested";
    }

    if (!merchant.isActive) {
      throw new AppError(
        "Your account is inactive. Please contact support",
        403
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex"); // should i do this 2 times

    const redisKey = `${this.RESET_TOKEN_PREFIX}${resetToken}`;
    await redis.setEx(redisKey, this.RESET_TOKEN_EXPIRY, merchant.id); // TODO fix
    // thing is it doesnt throws error for this one

    return resetToken; // TODO send via email
    // P.S SMTP is prolly blocked on DO
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const redisKey = `${this.RESET_TOKEN_PREFIX}${token}`;

    const merchantId = await redis.get(redisKey);

    if (!merchantId) {
      throw new AppError("Invalid or expired reset token (eat a dick)", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await prisma.merchant.update({
      where: { id: merchantId },
      data: { password: hashedPassword },
    });

    await redis.del(redisKey);
  }

  private generateAccessToken(merchantId: string): string {
    return jwt.sign({ merchantId }, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }
}

export default new MerchantService();
