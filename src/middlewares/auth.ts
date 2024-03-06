import { Context, Next } from "hono";
import { supabase } from "../database";
import { getSignedCookie } from "hono/cookie";
import { env } from "../config";

export const authMiddleware =
  () => async (c: Context<HonoVariables>, next: Next) => {
    const cookie = await getSignedCookie(
      c,
      env.AUTH_SECRET,
      `${env.COOKIE_KEY}_ACCESS_TOKEN`
    );

    if (cookie) {
      const {
        data: { user },
      } = await supabase.auth.getUser(cookie.toString());

      if (user) {
        c.set("user", user);

        return next();
      }
    }

    return c.json({ error: "Not authorized" }, 401);
  };
