import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/AppError.js";
import type { ApiKey } from "../generated/prisma/index.js";

class ApiKeyService {
  private readonly API_KEY_PREFIX = "sk_";
  private readonly API_KEY_LENGTH = 32;

  public async generateApiKey(
    merchantId: string,
    name?: string
  ): Promise<{ apiKey: ApiKey; key: string }> {
    // Generate a secure random API key
    const randomBytes = crypto.randomBytes(this.API_KEY_LENGTH);
    const key = this.API_KEY_PREFIX + randomBytes.toString("hex");

    const apiKey = await prisma.apiKey.create({
      data: {
        merchantId,
        key,
        name: name ?? null,
      },
    });

    // Return both the API key record and the actual key (only shown once)
    return { apiKey, key };
  }

  public async validateApiKey(
    key: string
  ): Promise<Omit<ApiKey, "key"> & { merchantId: string }> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key },
      include: {
        merchant: {
          select: {
            isActive: true,
          },
        },
      },
    });

    if (!apiKey) {
      throw new AppError("Invalid API key", 401);
    }

    if (!apiKey.isActive) {
      throw new AppError("API key is inactive", 401);
    }

    if (apiKey.revokedAt) {
      throw new AppError("API key has been revoked", 401);
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new AppError("API key has expired", 401);
    }

    if (!apiKey.merchant.isActive) {
      throw new AppError("Merchant account is inactive", 403);
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    // Return API key data without the actual key value
    const { key: _, merchant, ...apiKeyData } = apiKey;
    return apiKeyData;
  }

  public async revokeApiKey(merchantId: string, keyId: string): Promise<void> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey) {
      throw new AppError("API key not found", 404);
    }

    if (apiKey.merchantId !== merchantId) {
      throw new AppError("Unauthorized to revoke this API key", 403);
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });
  }

  public async getApiKeys(
    merchantId: string
  ): Promise<Omit<ApiKey, "key">[]> {
    const keys = await prisma.apiKey.findMany({
      where: {
        merchantId,
      },
      select: {
        id: true,
        merchantId: true,
        name: true,
        isActive: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
        key: false, // Never return the actual key
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return keys;
  }

  public async getApiKeyById(
    merchantId: string,
    keyId: string
  ): Promise<Omit<ApiKey, "key"> | null> {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        merchantId,
      },
      select: {
        id: true,
        merchantId: true,
        name: true,
        isActive: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
        key: false,
      },
    });

    return apiKey;
  }

  public async updateApiKey(
    merchantId: string,
    keyId: string,
    data: { name?: string; expiresAt?: Date | null }
  ): Promise<Omit<ApiKey, "key">> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey) {
      throw new AppError("API key not found", 404);
    }

    if (apiKey.merchantId !== merchantId) {
      throw new AppError("Unauthorized to update this API key", 403);
    }

    const updated = await prisma.apiKey.update({
      where: { id: keyId },
      data,
      select: {
        id: true,
        merchantId: true,
        name: true,
        isActive: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
        key: false,
      },
    });

    return updated;
  }
}

export default new ApiKeyService();
