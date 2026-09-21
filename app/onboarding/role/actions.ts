"use server";

import { redirect } from "next/navigation";
import { getPostAuthPath } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export type RoleFormState = { error: string | null };

const initialRoleFormState: RoleFormState = { error: null };

export async function selectRoleAction(
  _previousState: RoleFormState = initialRoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  void _previousState;
  const role = String(formData.get("role") ?? "").trim();
  if (role !== "visitor" && role !== "artisan") {
    return { error: "Choose whether you are visiting or creating a website." };
  }

  const user = await requireUser();
  const { data, error } = await user.supabase
    .from("profiles")
    .update({ role })
    .eq("id", user.userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("[onboarding:role] profile role update failed", error);
    return { error: "We could not save your account type. Please try again." };
  }

  redirect(await getPostAuthPath(user.supabase, user.userId));
}
