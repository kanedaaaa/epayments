import { createClient } from "redis";
import type { RedisModules, RedisClientType } from "redis";

const redisClient: RedisClientType<RedisModules> = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        console.error("Too many redis reconnection attempts"); // TODO replace with app error
        return new Error("Too many retries");
      }

      return retries * 100; // expo backoff
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis client connected yippie");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

export const redis = redisClient;
