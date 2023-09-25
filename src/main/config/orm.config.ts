import { DataSourceOptions } from "typeorm";
import ENV from "../../app/envs/env";

const env = ENV.Application.NODE_ENV;
const basePath = env === "DEVELOPMENT" ? "src" : "dist";

const ormConfig: DataSourceOptions = {
  type: "postgres",
  url: ENV.Database.DATABASE_URL,
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
  migrations: [`${basePath}/app/shared/database/migrations/**/*`],
  entities: [`${basePath}/app/shared/database/entities/**/*`],
};

export { ormConfig };

