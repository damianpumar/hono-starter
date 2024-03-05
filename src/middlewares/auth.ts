import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { env } from "@/config";

const getUserLoggedIn = async (c: Context<HonoVariables>) => {
  const cookie = await getSignedCookie(c, env.AUTH_SECRET, env.COOKIE_KEY);

  if (cookie) return JSON.parse(atob(cookie));

  const auth = c.req.header("Authorization");

  if (auth) {
    try {
      const [, token] = auth.split(" ");
      return await verify(token, env.AUTH_SECRET, "HS512");
    } catch {}
  }

  return null;
};

export const authMiddleware =
  () => async (c: Context<HonoVariables>, next: Next) => {
    const user = await getUserLoggedIn(c);

    if (user) {
      c.set("user", user);

      return next();
    }

    return c.json({ error: "Not authorized" }, 401);
  };
