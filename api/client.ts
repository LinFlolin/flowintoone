import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL – check Vercel env vars.");
}
if (!anon) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY – check Vercel env vars.");
}

export const supabase  = createClient<Database>(url, anon);
