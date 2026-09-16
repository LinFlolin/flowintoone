"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";

function profileRedirect(type: "error" | "message", message: string): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/dashboard/profile?${params.toString()}`);
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (fullName.length < 2 || fullName.length > 100) {
    profileRedirect("error", "Full name must be between 2 and 100 characters.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(
      `[profile:update] Supabase request failed ${JSON.stringify({
        code: error.code ?? null,
        message: error.message ?? null,
        details: error.details ?? null,
        hint: error.hint ?? null,
      })}`,
    );
    profileRedirect("error", "Your profile could not be updated. Please try again.");
  }

  if (!data) {
    profileRedirect(
      "error",
      "Your profile is not available yet. Please refresh the page and try again.",
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  profileRedirect("message", "Profile updated successfully.");
}
