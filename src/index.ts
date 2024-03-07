import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { showRoutes } from "hono/dev";

import { corsMiddleware } from "./middlewares";
import { routes } from "./routes";
import { env } from "./config";

const app = new Hono<HonoVariables>();

app.use(corsMiddleware());

if (!env.IS_PROD) {
  app.use("*", (c, next) => {
    console.log(`🚏 Request to: ${c.req.url}`);

    return next();
  });
}

app.route(env.BASE_URL, routes);

if (!env.IS_PROD) {
  console.log("🚦 Current Showing routes");

  showRoutes(app);
}

console.log(`🛳️  Server is running on port: ${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
