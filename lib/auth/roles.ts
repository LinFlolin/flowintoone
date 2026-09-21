import "server-only";

import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireUser } from "@/lib/auth/session";

export type AccountRole = "visitor" | "artisan";

function isAccountRole(value: unknown): value is AccountRole {
  return value === "visitor" || value === "artisan";
}

export async function getAccountRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<AccountRole | null> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return isAccountRole(data?.role) ? data.role : null;
}

export async function getPostAuthPath(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const role = await getAccountRole(supabase, userId);

  if (role === "visitor") return "/dashboard";

  if (role === "artisan") {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();

    return business ? "/dashboard" : "/dashboard/create-store";
  }

  return "/onboarding/role";
}

export async function requireArtisan() {
  const user = await requireUser();
  const role = await getAccountRole(user.supabase, user.userId);

  if (role !== "artisan") {
    redirect(role === "visitor" ? "/dashboard" : "/onboarding/role");
  }

  return { ...user, role };
}
