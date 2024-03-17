import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { Event } from "../events";
import { privateRoute } from "../middlewares";

const routes = new Hono<HonoVariables>();
const name = "sse";

routes.get("/", privateRoute(), async (c) => {
  const user = c.get("user");

  return streamSSE(c, async (stream) => {
    Event.subscribe(user.id, stream);

    stream.onAbort(() => {
      Event.remove(user.id);
    });

    await stream.writeSSE({
      id: Date.now().toString(),
      event: "connected",
      data: "Welcome!",
    });
  });
});

export { routes, name };
