import { DataSource } from "typeorm";
import ENV from "../../app/envs/env";

const env = ENV.Application.NODE_ENV;
const basePath = env === "PRODUCTION" ? "dist" : "src";
const dbUrl =
  env === "TEST" ? ENV.Database.DATABASE_URL_TEST : ENV.Database.DATABASE_URL;

const dataSource = new DataSource({
  type: "postgres",
  url: dbUrl,
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
  migrations: [`${basePath}/app/shared/database/migrations/**/*`],
  entities: [`${basePath}/app/shared/database/entities/**/*`],
});

export { dataSource };

