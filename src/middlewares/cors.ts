import { cors } from "hono/cors";

export const corsMiddleware = () =>
  cors({
    origin: "http://localhost:3001",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
