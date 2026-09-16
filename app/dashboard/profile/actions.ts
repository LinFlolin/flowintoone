"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import {
  isOwnedProfileAvatarPath,
  processProfileAvatar,
  PROFILE_AVATAR_BUCKET,
  ProfileAvatarValidationError,
  profileAvatarPath,
} from "@/lib/profile/avatar";

type SupabaseErrorDetails = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function profileRedirect(type: "error" | "message", message: string): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/dashboard/profile?${params.toString()}`);
}

function logProfileError(
  operation: string,
  error: SupabaseErrorDetails,
  context: Record<string, boolean | string> = {},
) {
  console.error(
    `[profile:${operation}] Supabase request failed ${JSON.stringify({
      code: error.code ?? null,
      message: error.message ?? null,
      details: error.details ?? null,
      hint: error.hint ?? null,
      ...context,
    })}`,
  );
}

async function removeAvatarObject(supabase: SupabaseClient, path: string | null, userId: string) {
  if (!isOwnedProfileAvatarPath(path, userId)) return;

  const { error } = await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([path]);
  if (error) {
    logProfileError("avatar-cleanup", error, { ownedPath: true });
  }
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const removeAvatar = formData.get("removeAvatar") === "1";
  const avatarEntry = formData.get("avatarImage");
  const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null;

  if (fullName.length < 2 || fullName.length > 100) {
    profileRedirect("error", "Full name must be between 2 and 100 characters.");
  }

  if (city.length > 120 || country.length > 120) {
    profileRedirect("error", "City and country must be 120 characters or fewer.");
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id, avatar_path")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    logProfileError("owner-read", profileError);
    profileRedirect("error", "Your profile could not be verified. Please try again.");
  }

  if (!currentProfile) {
    profileRedirect(
      "error",
      "Your profile is not available yet. Please refresh the page and try again.",
    );
  }

  let processedAvatar = null;
  if (avatarFile) {
    try {
      processedAvatar = await processProfileAvatar(avatarFile);
    } catch (error) {
      if (error instanceof ProfileAvatarValidationError) {
        profileRedirect("error", `Profile photo: ${error.message}`);
      }

      console.error("[profile:avatar-process] Image processing failed");
      profileRedirect("error", "The profile photo could not be processed. Try another image.");
    }
  }

  const previousAvatarPath = currentProfile.avatar_path as string | null;
  let uploadedAvatarPath: string | null = null;

  if (processedAvatar) {
    uploadedAvatarPath = profileAvatarPath(userId);
    const { error } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .upload(uploadedAvatarPath, processedAvatar.bytes, {
        cacheControl: "3600",
        contentType: processedAvatar.contentType,
        upsert: false,
      });

    if (error) {
      logProfileError("avatar-upload", error, { ownerNamespace: true });
      profileRedirect(
        "error",
        "The profile photo could not be uploaded. Check the profile Storage migration.",
      );
    }
  }

  const nextAvatarPath = uploadedAvatarPath ?? (removeAvatar ? null : previousAvatarPath);
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      city: city || null,
      country: country || null,
      avatar_path: nextAvatarPath,
    })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    if (error) {
      logProfileError("update", error, { avatarUploaded: Boolean(uploadedAvatarPath) });
    }
    await removeAvatarObject(supabase, uploadedAvatarPath, userId);

    profileRedirect(
      "error",
      error
        ? "Your profile could not be updated. Please try again."
        : "Your profile is not available yet. Please refresh the page and try again.",
    );
  }

  if (previousAvatarPath !== nextAvatarPath) {
    await removeAvatarObject(supabase, previousAvatarPath, userId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  profileRedirect("message", "Profile updated successfully.");
}
