import { Redis } from "ioredis";
import { redisDatabase } from "../config/cache.config";

class RedisProvider {
  static client: Redis;

  static async connect(): Promise<void> {
    if (!this.client) {
      this.client = redisDatabase;
      console.log("Redis connected.");
    }
  }

  static disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      console.log("Redis disconnected");
    }
  }

  static get Client(): Redis {
    if (!this.client) {
      throw new Error("Connection not established with Redis.");
    }

    return this.client;
  }
}

export { RedisProvider };

