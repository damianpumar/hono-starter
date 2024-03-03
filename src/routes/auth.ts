import { Hono } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import { jwt, sign } from "hono/jwt";
import { authMiddleware } from "../middlewares";
import config from "../config";

const routes = new Hono<HonoVariables>();
const name = "auth";

routes.post("/sign-in", async (c) => {
  const user = {
    id: 1,
  };

  await setSignedCookie(
    c,
    config.auth.cookie.key,
    btoa(JSON.stringify(user)),
    config.auth.secret,
    {
      httpOnly: true,
      expires: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * config.auth.cookie.expirationDays
      ),
      sameSite: "None",
      domain: config.auth.cookie.domain,
      secure: true,
    }
  );

  const token = await sign(user, config.auth.secret, "HS512");

  return c.json({
    token,
    message: "Sign-in successful",
  });
});

routes.get("/me", authMiddleware(), (c) => {
  const user = c.get("user");

  return c.json({ user });
});

routes.post("/sign-out", (c) => {
  deleteCookie(c, config.auth.cookie.key);

  return c.json({ message: "Sign-out successful" });
});

export { routes, name };
