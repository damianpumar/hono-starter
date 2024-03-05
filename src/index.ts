import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { showRoutes } from "hono/dev";
import { compress } from "hono/compress";

import { corsMiddleware } from "./middlewares";
import { routes } from "./routes";
import config from "./config";

const { port } = config.server;

const app = new Hono<HonoVariables>();

app.use(compress(), corsMiddleware());

app.route("/", routes);

console.log(`🛳️  Server is running on port: ${port}`);

if (!config.isProd) {
  console.log(showRoutes(app));
}

serve({
  fetch: app.fetch,
  port,
});
