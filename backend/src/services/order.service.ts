import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/AppError.js";
import evmService from "./evm.service.js";
import type { Order } from "../generated/prisma/index.js";

interface CreateOrderData {
  amount: string;
  currency: string;
  expiresInMinutes?: number;
}

class OrderService {
  private readonly SUPPORTED_CURRENCIES = ["ETH", "MATIC", "BNB"];
  private readonly DEFAULT_EXPIRY_MINUTES = 30;

  public async createOrder(
    merchantId: string,
    data: CreateOrderData
  ): Promise<Order> {
    const { amount, currency, expiresInMinutes } = data;

    // Validate currency
    if (!this.SUPPORTED_CURRENCIES.includes(currency)) {
      throw new AppError(
        `Unsupported currency: ${currency}. Supported: ${this.SUPPORTED_CURRENCIES.join(", ")}`,
        400
      );
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new AppError("Invalid amount. Must be a positive number", 400);
    }

    // Generate temp wallet for this order
    const wallet = evmService.generateTempWallet();

    // Calculate expiration
    const expiryMinutes = expiresInMinutes || this.DEFAULT_EXPIRY_MINUTES;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Create order
    const order = await prisma.order.create({
      data: {
        merchantId,
        amount,
        currency,
        depositAddress: wallet.address,
        privateKey: wallet.privateKey, // TODO: Encrypt this!
        expiresAt,
      },
    });

    return order;
  }

  public async getOrder(orderId: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    return order;
  }

  public async getOrderByAddress(
    depositAddress: string
  ): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { depositAddress },
    });

    return order;
  }

  public async getOrdersByMerchant(
    merchantId: string,
    status?: "pending" | "paid" | "expired" | "failed"
  ): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        merchantId,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  }

  public async updateOrderStatus(
    orderId: string,
    status: string,
    txHash?: string
  ): Promise<Order> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === "paid") {
      updateData.paidAt = new Date();
    }

    if (txHash) {
      updateData.txHash = txHash;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return order;
  }

  public async expireOldOrders(): Promise<number> {
    const result = await prisma.order.updateMany({
      where: {
        status: "pending",
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: "expired",
      },
    });

    return result.count;
  }
}

export default new OrderService();
