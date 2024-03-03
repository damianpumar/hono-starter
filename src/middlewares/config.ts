import { Context, Next } from "hono";
import { Cookies } from "../config";

export const configMiddleware =
  () => async (c: Context<HonoVariables>, next: Next) => {
    c.set("cookiesKey", Cookies.key);
    c.set("cookiesSecret", Cookies.secret);

    return next();
  };
