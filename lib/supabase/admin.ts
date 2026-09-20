import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the server-only service role key.
 *
 * This client must never be imported into a Client Component or exposed to
 * the browser. It is used only for account deletion, which cannot be done
 * with a publishable key.
 */
export function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service role credentials are not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
