import { Hono } from "hono";

const authors = new Hono();

authors.get("/", (c) => c.json("list authors"));
authors.post("/", (c) => c.json("create an author", 201));
authors.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export { authors };
