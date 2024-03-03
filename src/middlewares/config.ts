import { Context, Next } from "hono";
import config from "../config";

export const configMiddleware =
  () => async (c: Context<HonoVariables>, next: Next) => {
    c.set("cookiesKey", config.cookies.key);
    c.set("cookiesSecret", config.cookies.secret);

    return next();
  };
