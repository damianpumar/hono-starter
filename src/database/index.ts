import { env } from "../config";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = env;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE
);
