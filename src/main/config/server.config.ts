import express, { Express } from "express";
import { middlewares } from "./middlewares.config";
import { createAppRoutes } from "./routes.config";

function createServerApplication(): Express {
  const app = express();
  middlewares.forEach((middleware) => app.use(middleware));
  
  createAppRoutes(app);
  
  return app;
}

export { createServerApplication };

