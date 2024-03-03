import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const books = new Hono();

const bookCreationScheme = z.object({
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
  price: z.number(),
});

books.get("/", (c) => c.json("list books"));

books.post("/", zValidator("json", bookCreationScheme), (c) =>
  c.json("create a book", 201)
);

books.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export { books };
