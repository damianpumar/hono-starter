import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { supabase } from "../database";
import { privateRoute } from "../middlewares";

const routes = new Hono<HonoVariables>();
const name = "countries";

const countryCreationScheme = z.object({
  name: z.string(),
});

routes.get("/", privateRoute(), async (c) => {
  const { data: countries } = await supabase.from("countries").select("*");

  return c.json(countries);
});

routes.post(
  "/",
  privateRoute(),
  zValidator("json", countryCreationScheme),
  async (c) => {
    const { name } = c.req.valid("json");

    const { data: country } = await supabase
      .from("countries")
      .insert({ name })
      .select("*");

    return c.json(country);
  }
);

routes.get("/:id", privateRoute(), async (c) => {
  const id = c.req.param("id");

  const { data: country } = await supabase
    .from("countries")
    .select("*")
    .eq("id", id);

  if (country?.length === 0) return c.notFound();

  return c.json(country);
});

export { routes, name };
