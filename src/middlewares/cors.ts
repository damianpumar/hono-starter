import { cors } from "hono/cors";
import { env } from "@/config";

export const corsMiddleware = () =>
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: env.CORS_METHODS,
    credentials: env.CORS_CREDENTIALS,
  });
