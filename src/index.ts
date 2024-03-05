import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { showRoutes } from "hono/dev";
import { compress } from "hono/compress";

import { corsMiddleware } from "@/middlewares";
import { routes } from "@/routes";
import { env } from "@/config";

const app = new Hono<HonoVariables>();

app.use(compress(), corsMiddleware());

app.route(env.BASE_URL, routes);

if (!env.IS_PROD) {
  console.log(showRoutes(app));
}

console.log(`🛳️  Server is running on port: ${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
