import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { configMiddleware, corsMiddleware } from "./middlewares";
import { routes } from "./routes";
import { showRoutes } from "hono/dev";
import config from "./config";

const app = new Hono<HonoVariables>();

app.route("/", routes);

const port = 3000;

console.log(`🛳️ Server is running on port: ${port}`);

if (!config.isProd) {
  console.log(showRoutes(app));
}

serve({
  fetch: app.fetch,
  port,
});
