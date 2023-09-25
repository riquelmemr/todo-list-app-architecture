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
    REDIS_URL: process.env.REDIS_URL!
  },
}

export default ENV;