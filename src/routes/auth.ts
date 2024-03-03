import { Hono } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import { authMiddleware } from "../middlewares";

const routes = new Hono<HonoVariables>();
const name = "auth";

routes.post("/sign-in", async (c) => {
  //TODO: implement sign-in

  const user = {
    id: 1,
  };

  await setSignedCookie(
    c,
    c.get("cookiesKey"),
    btoa(JSON.stringify(user)),
    c.get("cookiesSecret"),
    {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "None",
      domain: "localhost",
      secure: true,
    }
  );

  return c.json({ message: "Sign-in successful" });
});

routes.get("/me", authMiddleware(), (c) => {
  const user = c.get("user");

  return c.json({ user });
});

routes.post("/sign-out", (c) => {
  deleteCookie(c, c.get("cookiesKey"));

  return c.json({ message: "Sign-out successful" });
});

export { routes, name };
