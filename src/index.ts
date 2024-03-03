import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { configMiddleware, corsMiddleware } from "./middlewares";
import { routes } from "./routes";

const app = new Hono<HonoVariables>();

app.use("*", corsMiddleware(), configMiddleware());

app.route("/", routes);

const port = 3000;

console.log(`🛳️ Server is running on port: ${port}`);

serve({
  fetch: app.fetch,
  port,
});
