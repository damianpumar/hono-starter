import "dotenv/config";
import { z } from "zod";

console.log("🔐 Loading environment variables...");

const serverSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  BASE_URL: z.string(),

  // Auth
  AUTH_SECRET: z.string().min(5),

  // Cookies
  COOKIE_DOMAIN: z.string().min(1),
  COOKIE_KEY: z.string().min(1),
  COOKIE_EXPIRES: z.string(),

  // Cors
  CORS_ORIGIN: z.string().min(1),
  CORS_METHODS: z.string(),
  CORS_CREDENTIALS: z.string(),

  // Supabase
  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
});

const serverEnv = serverSchema.safeParse(process.env);

if (!serverEnv.success) {
  console.error("❌ Invalid environment variables:\n");
  serverEnv.error.issues.forEach((issue) => {
    console.error(issue);
  });
  throw new Error("Invalid environment variables");
}

const {
  NODE_ENV,
  PORT,
  BASE_URL,
  COOKIE_DOMAIN,
  COOKIE_EXPIRES,
  COOKIE_KEY,
  CORS_CREDENTIALS,
  CORS_METHODS,
  CORS_ORIGIN,
  AUTH_SECRET,
  SUPABASE_SERVICE_ROLE,
  SUPABASE_URL,
} = serverEnv.data;

export const env = {
  IS_PROD: NODE_ENV === "production",
  PORT: Number(PORT),
  BASE_URL,
  COOKIE_DOMAIN,
  COOKIE_EXPIRES: Number(COOKIE_EXPIRES),
  COOKIE_KEY,
  CORS_CREDENTIALS: CORS_CREDENTIALS === "true",
  CORS_METHODS: CORS_METHODS.split(","),
  CORS_ORIGIN,
  AUTH_SECRET,
  SUPABASE_SERVICE_ROLE,
  SUPABASE_URL,
};

console.log("✅ Environment variables loaded");
