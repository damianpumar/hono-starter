import { Context, Hono } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { authMiddleware } from "../middlewares";
import { env } from "../config";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { supabase } from "../database";
import { HTTPException } from "hono/http-exception";
import { Session } from "@supabase/supabase-js";

const userSignInScheme = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const userSignUpScheme = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const routes = new Hono<HonoVariables>();
const name = "auth";

const setSessionCookies = async (c: Context, session: Session) => {
  await setSignedCookie(
    c,
    `${env.COOKIE_KEY}_ACCESS_TOKEN`,
    session.access_token,
    env.AUTH_SECRET,
    {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.COOKIE_EXPIRES),
      sameSite: "None",
      domain: env.COOKIE_DOMAIN,
      secure: true,
    }
  );

  await setSignedCookie(
    c,
    `${env.COOKIE_KEY}_REFRESH_TOKEN`,
    session.refresh_token,
    env.AUTH_SECRET,
    {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.COOKIE_EXPIRES),
      sameSite: "None",
      domain: env.COOKIE_DOMAIN,
      secure: true,
    }
  );
};

routes.post("/sign-in", zValidator("json", userSignInScheme), async (c) => {
  const { email, password } = c.req.valid("json");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new HTTPException(401, { message: error.message });
  }

  await setSessionCookies(c, data.session);

  return c.json({
    message: "sign-in successful",
  });
});

routes.post("/sign-up", zValidator("json", userSignUpScheme), async (c) => {
  const { email, password } = c.req.valid("json");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new HTTPException(401, { message: error.message });
  }

  if (!data?.session) {
    throw new HTTPException(401, { message: "No session" });
  }

  return c.json({
    message: "sign-up successful",
  });
});

routes.get("/me", authMiddleware(), (c) => {
  const user = c.get("user");

  return c.json({ user });
});

routes.get("/refresh", async (c) => {
  const refresh_token = await getSignedCookie(
    c,
    env.AUTH_SECRET,
    `${env.COOKIE_KEY}_REFRESH_TOKEN`
  );

  if (!refresh_token) {
    throw new HTTPException(403, { message: "No refresh token" });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error) {
    throw new HTTPException(403, { message: error.message });
  }

  if (!data?.session) {
    throw new HTTPException(403, { message: "No session" });
  }

  await setSessionCookies(c, data.session);

  return c.newResponse(null, 200);
});

routes.post("/sign-out", authMiddleware(), async (c) => {
  await supabase.auth.signOut();

  deleteCookie(c, `${env.COOKIE_KEY}_ACCESS_TOKEN`);
  deleteCookie(c, `${env.COOKIE_KEY}_REFRESH_TOKEN`);

  return c.json({ message: "sign-out successful" });
});

export { routes, name };
