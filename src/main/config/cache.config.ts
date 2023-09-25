import Redis from "ioredis";
import ENV from "../../app/envs/env";

export const redisDatabase = new Redis(ENV.Database.REDIS_URL);