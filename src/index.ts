import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { authors, books } from "./routes";

const app = new Hono();

app.route("/authors", authors);
app.route("/books", books);

const port = 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
