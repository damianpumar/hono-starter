import { cors } from "hono/cors";
import config from "../config";

export const corsMiddleware = () =>
  cors({
    origin: config.cors.origin,
    allowMethods: config.cors.allowMethods,
    credentials: config.cors.credentials,
  });
