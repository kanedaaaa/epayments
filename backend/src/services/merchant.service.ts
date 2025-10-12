import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { Merchant } from "../generated/prisma/index.js";

interface SignupData {
  name: string;
  email: string;
  password: string;
  webhookUrl?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateData {
  name?: string;
  webhookUrl?: string;
  isActive?: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class MerchantService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
  private readonly ACCESS_TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";
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

  public async signup(data: SignupData): Promise<{ merchant: Omit<Merchant, "password">; tokens: AuthTokens }> {
    const existingMerchant = await this.getByEmail(data.email);
    if (existingMerchant) {
      throw new Error("Merchant with this email already exists");
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

    const tokens = await this.generateTokens(merchant.id);

    return { merchant, tokens };
  }

  public async login(data: LoginData): Promise<{ merchant: Omit<Merchant, "password">; tokens: AuthTokens }> {
    const merchant = await this.getByEmail(data.email);
    if (!merchant) {
      throw new Error("Invalid credentials");
    }

    if (!merchant.isActive) {
      throw new Error("Merchant account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(data.password, merchant.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const tokens = await this.generateTokens(merchant.id);

    const { password, ...merchantWithoutPassword } = merchant;

    return { merchant: merchantWithoutPassword, tokens };
  }

  public async update(id: string, data: UpdateData): Promise<Omit<Merchant, "password">> {
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

  public async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { merchantId: string };

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token");
      }

      return await this.generateTokens(decoded.merchantId);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  public verifyAccessToken(token: string): { merchantId: string } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { merchantId: string };
      return decoded;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  private async generateTokens(merchantId: string): Promise<AuthTokens> {
    const accessToken = jwt.sign({ merchantId }, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ merchantId }, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        merchantId,
        token: refreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export default new MerchantService();
