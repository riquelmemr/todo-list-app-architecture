import ENV from "@app/envs/env";
import express, { Express } from "express";
import { middlewares } from "./middlewares.config";
import { createAppRoutes } from "./routes.config";

interface ServerOptions {
  listenBefore?: boolean;
}

function createServerApplication(serverOptions?: ServerOptions): Express {
  const app = express();
  middlewares.forEach((middleware) => app.use(middleware));

  createAppRoutes(app);

  if (serverOptions?.listenBefore) {
    const env = ENV.Application.NODE_ENV;
    const port = ENV.Application.PORT || 8080;

    app.listen(port, () => {
      console.log(`[${env}] Server is running on port ${port}.`);
    });
  }

  return app;
}

export { createServerApplication };

