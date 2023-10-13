import "dotenv/config";

const ENV = {
  Application: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
  },
  Database: {
    DATABASE_URL: process.env.DATABASE_URL!,
    REDIS_URL: process.env.REDIS_URL!,
    DATABASE_URL_TEST: process.env.DATABASE_URL_TEST!,
  },
}

export default ENV;