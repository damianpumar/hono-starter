import { Hono } from "hono";

const routes = new Hono<HonoVariables>();
const name = "health";

routes.get("/", (c) =>
  c.json({
    status: "ok",
    when: new Date().toISOString(),
  })
);

export { routes, name };
