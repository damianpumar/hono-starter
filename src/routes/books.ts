import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const routes = new Hono<HonoVariables>();
const name = "books";

const bookCreationScheme = z.object({
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
  price: z.number(),
});

routes.get("/", (c) => c.json("list books"));

routes.post("/", zValidator("json", bookCreationScheme), (c) =>
  c.json("create a book", 201)
);

routes.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export { routes, name };
