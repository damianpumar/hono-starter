import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import config from "../config";

export const authMiddleware =
  () => async (c: Context<HonoVariables>, next: Next) => {
    const cookie = await getSignedCookie(
      c,
      config.auth.secret,
      config.auth.cookie.key
    );

    if (cookie) {
      c.set("user", JSON.parse(atob(cookie)));

      return next();
    }

    const auth = c.req.header("Authorization")?.split(" ")[1];

    if (auth) {
      try {
        const user = await verify(auth, config.auth.secret, "HS512");

        c.set("user", user);

        return next();
      } catch {}
    }

    return c.json({ error: "Not authorized" }, 401);
  };
