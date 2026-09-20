"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isOwnedProfileAvatarPath,
  processProfileAvatar,
  PROFILE_AVATAR_BUCKET,
  ProfileAvatarValidationError,
  profileAvatarPath,
} from "@/lib/profile/avatar";
import { STOREFRONT_IMAGE_BUCKET } from "@/lib/storefront/images";

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

const ACCOUNT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function listOwnedStorageObjects(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
) {
  const paths: string[] = [];

  async function walk(prefix: string, depth: number): Promise<void> {
    // Storage list is paginated. Keep walking until the page is smaller than
    // the limit so large accounts are cleaned up completely.
    const limit = 1000;
    for (let offset = 0; ; offset += limit) {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) throw error;

      for (const entry of data ?? []) {
        const path = prefix ? `${prefix}/${entry.name}` : entry.name;
        // Folders have a null id; files have an id and can be removed directly.
        if (entry.id) {
          paths.push(path);
        } else if (depth < 10) {
          await walk(path, depth + 1);
        }
      }

      if (!data || data.length < limit) break;
    }
  }

  await walk(userId, 0);
  return paths;
}

async function removeOwnedStorageObjects(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
) {
  const paths = await listOwnedStorageObjects(supabase, bucket, userId);
  for (let index = 0; index < paths.length; index += 100) {
    const { error } = await supabase.storage.from(bucket).remove(paths.slice(index, index + 100));
    if (error) throw error;
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

/**
 * Permanently removes the signed-in account and all data owned by it.
 *
 * Auth users can sign themselves out with the publishable client, but only a
 * trusted server-side service-role client can delete an Auth user. Storage is
 * cleaned first because Storage objects are not removed by Auth cascades.
 */
export async function deleteAccountAction(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (confirmation !== "DELETE") {
    profileRedirect("error", 'Type "DELETE" to confirm account deletion.');
  }

  if (!ACCOUNT_ID_PATTERN.test(userId)) {
    console.error("[profile:account-delete] Refusing to process an invalid user ID");
    profileRedirect("error", "Your session is invalid. Please log out and sign in again.");
  }

  let admin: SupabaseClient;
  try {
    admin = createAdminClient();

    // Remove every object below the authenticated user's namespace, including
    // profile avatars and storefront media that may no longer be referenced by
    // a database row.
    await removeOwnedStorageObjects(admin, PROFILE_AVATAR_BUCKET, userId);
    await removeOwnedStorageObjects(admin, STOREFRONT_IMAGE_BUCKET, userId);

    const { error: businessesError } = await admin
      .from("businesses")
      .delete()
      .eq("owner_id", userId);
    if (businessesError) throw businessesError;

    const { error: profileError } = await admin.from("profiles").delete().eq("id", userId);
    if (profileError) throw profileError;

    const { error: authError } = await admin.auth.admin.deleteUser(userId);
    if (authError) throw authError;
  } catch (error) {
    logProfileError("account-delete", error as SupabaseErrorDetails, {
      accountDeletionRequested: true,
    });
    profileRedirect(
      "error",
      "Your account could not be deleted. Check the Supabase service-role setup and try again.",
    );
  }

  await supabase.auth.signOut();
  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/login?message=Your%20account%20has%20been%20deleted%20successfully.");
}
