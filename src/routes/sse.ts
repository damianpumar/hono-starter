import { Hono } from "hono";
import { SSEStreamingApi } from "hono/streaming";
import { Event } from "../events";
import { privateRoute } from "../middlewares";

const routes = new Hono<HonoVariables>();
const name = "sse";

routes.get("/", privateRoute(), async (c) => {
  const user = c.get("user");

  const { readable, writable } = new TransformStream();
  const stream = new SSEStreamingApi(writable, readable);

  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  Event.subscribe(user.id, stream);

  stream.onAbort(() => {
    Event.remove(user.id);
  });

  await stream.writeSSE({
    id: Date.now().toString(),
    event: "connected",
    data: "Welcome!",
  });

  return c.newResponse(stream.responseReadable);
});

export { routes, name };
