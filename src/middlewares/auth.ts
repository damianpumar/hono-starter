import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

export const authMiddleware =
  () => async (c: Context<HonoVariables>, next: Next) => {
    const sessionId = await getSignedCookie(
      c,
      c.get("cookiesSecret"),
      c.get("cookiesKey")
    );

    if (!sessionId) {
      c.set("user", null);

      return c.json({ error: "Not authorized" }, 401);
    }

    c.set("user", JSON.parse(atob(sessionId)));

    return next();
  };
