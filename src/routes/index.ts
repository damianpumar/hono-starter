import { Hono } from "hono";

import * as auth from "./auth";
import * as authors from "./authors";
import * as countries from "./countries";
import * as health from "./health";
import * as sse from "./sse";
import * as helloTest from "./hello-test";

const routes = new Hono<HonoVariables>();

[auth, authors, countries, health, sse, helloTest].forEach((route) => {
  routes.route(route.name, route.routes);
});

export { routes };
