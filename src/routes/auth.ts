import { Hono } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { authMiddleware } from "../middlewares";
import { env } from "@/config";

type SignInBody = {
  email: string;
  password: string;
  strategy: "cookie" | "bearer";
};

const routes = new Hono<HonoVariables>();
const name = "auth";

routes.post("/sign-in", async (c) => {
  const { email, password, strategy } = await c.req.json<SignInBody>();

  const user = {
    id: 1,
  };

  if (strategy === "bearer") {
    const token = await sign(user, env.AUTH_SECRET, "HS512");

    return c.json({
      token,
      strategy,
      message: "Sign-in successful",
    });
  }

  if (strategy === "cookie") {
    await setSignedCookie(
      c,
      env.COOKIE_KEY,
      btoa(JSON.stringify(user)),
      env.AUTH_SECRET,
      {
        httpOnly: true,
        expires: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * env.COOKIE_EXPIRES
        ),
        sameSite: "None",
        domain: env.COOKIE_DOMAIN,
        secure: true,
      }
    );

    return c.json({
      strategy,
      message: "Sign-in successful",
    });
  }

  return c.json({ error: "Invalid strategy to sign-in" }, 400);
});

routes.get("/me", authMiddleware(), (c) => {
  const user = c.get("user");

  return c.json({ user });
});

routes.post("/sign-out", (c) => {
  deleteCookie(c, env.COOKIE_KEY);

  return c.json({ message: "Sign-out successful" });
});

export { routes, name };
