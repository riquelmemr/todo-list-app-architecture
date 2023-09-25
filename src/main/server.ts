import { Express } from 'express';
import ENV from "../app/envs/env";
import { createServerApplication } from "./config";
import { TypeORMProvider } from "./database";
import { RedisProvider } from "./database/redis.provider";

async function bootstrap(): Promise<Express> {
  const app = createServerApplication();
  const port = ENV.Application.PORT || 8080;

  await RedisProvider.connect();
  await TypeORMProvider.connect();

  app.listen(port, () => {
    console.log(`[${ENV.Application.NODE_ENV}] Server is running on port ${port}.`);
  });

  return app;
}

export const app = bootstrap();