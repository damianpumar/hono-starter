import { Hono } from "hono";

const routes = new Hono<HonoVariables>();
const name = "authors";

routes.get("/", (c) => c.json("list authors"));
routes.post("/", (c) => c.json("create an author", 201));
routes.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export { routes, name };
