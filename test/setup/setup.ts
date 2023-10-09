import { RedisProvider, TypeORMProvider } from "@main/database";

beforeAll(async () => {
  await TypeORMProvider.connect();
  await RedisProvider.connect();
});

afterAll(async () => {
  await TypeORMProvider.disconnect();
  RedisProvider.disconnect();
});