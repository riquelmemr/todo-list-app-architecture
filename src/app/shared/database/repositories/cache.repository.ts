import { RedisProvider } from "../../../../main/database/redis.provider";
import { ICacheRepository } from "../interfaces/cache-repository.interface";

class CacheRepository implements ICacheRepository {
  private redis = RedisProvider.Client;

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T): Promise<"OK"> {
    return this.redis.set(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }
}

export { CacheRepository };
