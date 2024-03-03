import { Hono } from "hono";

import * as auth from "./auth";
import * as authors from "./authors";
import * as books from "./books";

const routes = new Hono<HonoVariables>();

[auth, authors, books].forEach((route) => {
  routes.route(route.name, route.routes);
});

export { routes };
