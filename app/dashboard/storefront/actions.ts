"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import {
  processStorefrontImage,
  STOREFRONT_IMAGE_BUCKET,
  StorefrontImageValidationError,
  storefrontImagePath,
  storefrontObjectPathFromPublicUrl,
  type ProcessedStorefrontImage,
} from "@/lib/storefront/images";
import { normalizeStorefrontSlug } from "@/lib/storefront/slug";

type SupabaseErrorDetails = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

type ImageKind = "logo" | "cover";

type PendingImage = {
  kind: ImageKind;
  image: ProcessedStorefrontImage;
};

type UploadedImage = {
  kind: ImageKind;
  path: string;
  publicUrl: string;
};

function logSupabaseError(
  operation: string,
  error: SupabaseErrorDetails,
  context: Record<string, boolean | string | null> = {},
) {
  const diagnostic = {
    code: error.code ?? null,
    message: error.message ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
    ...context,
  };

  console.error(
    `[storefront:${operation}] Supabase request failed ${JSON.stringify(diagnostic)}`,
  );
}

function getField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getOptionalFile(formData: FormData, name: string) {
  const entry = formData.get(name);
  return entry instanceof File && entry.size > 0 ? entry : null;
}

function normalizeOptionalUrl(value: string) {
  if (!value) return { value: null, error: null };

  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(normalized);

    if (!["http:", "https:"].includes(url.protocol)) {
      return { value: null, error: "Only HTTP or HTTPS links are supported." };
    }

    return { value: url.toString(), error: null };
  } catch {
    return { value: null, error: "Enter a valid website or Instagram URL." };
  }
}

function storefrontRedirect(type: "error" | "message", message: string): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/dashboard/storefront?${params.toString()}`);
}

async function prepareImage(file: File | null, kind: ImageKind): Promise<PendingImage | null> {
  if (!file) return null;

  try {
    return { kind, image: await processStorefrontImage(file, kind) };
  } catch (error) {
    if (error instanceof StorefrontImageValidationError) {
      storefrontRedirect("error", `${kind === "logo" ? "Logo" : "Cover image"}: ${error.message}`);
    }

    console.error(`[storefront:image-process] ${kind} image processing failed`);
    storefrontRedirect(
      "error",
      `The ${kind === "logo" ? "logo" : "cover image"} could not be processed. Try another image.`,
    );
  }
}

async function removeUploadedObjects(supabase: SupabaseClient, paths: string[]) {
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove(paths);
  if (error) {
    logSupabaseError("image-cleanup", error, { objectCount: String(paths.length) });
  }
}

async function uploadImages(
  supabase: SupabaseClient,
  userId: string,
  businessId: string,
  images: PendingImage[],
) {
  const uploaded: UploadedImage[] = [];

  for (const { kind, image } of images) {
    const path = storefrontImagePath(userId, businessId, kind);
    const { error } = await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).upload(path, image.bytes, {
      cacheControl: "31536000",
      contentType: image.contentType,
      upsert: false,
    });

    if (error) {
      logSupabaseError("image-upload", error, {
        imageKind: kind,
        businessIdPresent: true,
        ownerIdFromVerifiedClaims: true,
      });
      await removeUploadedObjects(
        supabase,
        uploaded.map((item) => item.path),
      );
      storefrontRedirect(
        "error",
        "The images could not be uploaded. Check the Storage policies and try again.",
      );
    }

    const { data } = supabase.storage.from(STOREFRONT_IMAGE_BUCKET).getPublicUrl(path);
    uploaded.push({ kind, path, publicUrl: data.publicUrl });
  }

  return uploaded;
}

export async function saveStorefrontAction(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const hasValidAuthenticatedUserId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      userId,
    );

  if (!hasValidAuthenticatedUserId) {
    console.error("[storefront:auth] Authenticated claim has an invalid user ID format");
    storefrontRedirect("error", "Your session is invalid. Please log out and sign in again.");
  }

  const submittedBusinessId = getField(formData, "businessId");
  const intent = getField(formData, "intent") === "publish" ? "publish" : "save";
  const name = getField(formData, "name");
  const description = getField(formData, "description");
  const categoryId = getField(formData, "categoryId");
  const city = getField(formData, "city");
  const country = getField(formData, "country");
  const contactEmail = getField(formData, "contactEmail").toLowerCase();
  const website = normalizeOptionalUrl(getField(formData, "websiteUrl"));
  const instagram = normalizeOptionalUrl(getField(formData, "instagramUrl"));

  if (name.length < 2 || name.length > 100) {
    storefrontRedirect("error", "Business name must be between 2 and 100 characters.");
  }
  if (!categoryId) {
    storefrontRedirect("error", "Select a category.");
  }
  if (description.length > 2000 || city.length > 120 || country.length > 120) {
    storefrontRedirect("error", "One or more text fields are too long.");
  }
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    storefrontRedirect("error", "Enter a valid public contact email.");
  }
  if (website.error || instagram.error) {
    storefrontRedirect("error", website.error || instagram.error || "Enter a valid URL.");
  }

  const pendingImages = (
    await Promise.all([
      prepareImage(getOptionalFile(formData, "logoImage"), "logo"),
      prepareImage(getOptionalFile(formData, "coverImage"), "cover"),
    ])
  ).filter((image): image is PendingImage => image !== null);

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (categoryError) {
    logSupabaseError("category-read", categoryError, {
      authenticated: true,
      categoryIdPresent: Boolean(categoryId),
    });
    storefrontRedirect("error", "The selected category could not be verified.");
  }

  if (!category) {
    storefrontRedirect("error", "The selected category is not available.");
  }

  let existingStatus: string | null = null;
  let existingSlug: string | null = null;
  let existingName: string | null = null;
  let oldLogoUrl: string | null = null;
  let oldCoverUrl: string | null = null;

  if (submittedBusinessId) {
    const { data: existingBusiness, error: existingError } = await supabase
      .from("businesses")
      .select("id, status, slug, name, logo_url, cover_image_url")
      .eq("id", submittedBusinessId)
      .eq("owner_id", userId)
      .maybeSingle();

    if (existingError) {
      logSupabaseError("owner-read", existingError, {
        authenticated: true,
        businessIdPresent: true,
      });
      storefrontRedirect("error", "This storefront could not be verified.");
    }

    if (!existingBusiness) {
      storefrontRedirect("error", "This storefront was not found or cannot be edited.");
    }

    existingStatus = existingBusiness.status;
    existingSlug = existingBusiness.slug;
    existingName = existingBusiness.name;
    oldLogoUrl = existingBusiness.logo_url;
    oldCoverUrl = existingBusiness.cover_image_url;
  } else if (intent === "publish") {
    storefrontRedirect("error", "Create the draft before publishing it.");
  }

  let slug =
    (existingSlug && name === existingName ? existingSlug : normalizeStorefrontSlug(name)) ||
    `maker-${userId.replaceAll("-", "").slice(0, 8)}`;
  const willBePublished = intent === "publish" || existingStatus === "published";

  if (willBePublished && (!description || !city || !country)) {
    storefrontRedirect(
      "error",
      "Add a description, city, and country before publishing your storefront.",
    );
  }

  const values = {
    name,
    slug,
    description: description || null,
    category_id: categoryId,
    city: city || null,
    country: country || null,
    website_url: website.value,
    instagram_url: instagram.value,
    contact_email: contactEmail || null,
  };

  let businessId = submittedBusinessId;
  const isNewStorefront = !businessId;

  if (isNewStorefront) {
    let createResult = await supabase
      .from("businesses")
      .insert({ ...values, owner_id: userId, status: "draft" })
      .select("id")
      .maybeSingle();

    if (createResult.error?.code === "23505") {
      const uniqueSlug = `${slug.slice(0, 71)}-${crypto.randomUUID().slice(0, 8)}`;
      createResult = await supabase
        .from("businesses")
        .insert({ ...values, slug: uniqueSlug, owner_id: userId, status: "draft" })
        .select("id")
        .maybeSingle();
      slug = uniqueSlug;
    }

    if (createResult.error) {
      logSupabaseError("insert", createResult.error, {
        authenticated: true,
        ownerIdFromVerifiedClaims: true,
        status: "draft",
        categoryIdPresent: true,
        slugPresent: true,
      });
      storefrontRedirect("error", "The storefront could not be saved. Please try again.");
    }

    if (!createResult.data) {
      console.error("[storefront:write-result] Supabase returned no row and no error", {
        operation: "insert",
        authenticated: true,
        ownerIdFromVerifiedClaims: true,
      });
      storefrontRedirect("error", "The storefront could not be saved with your account.");
    }

    businessId = createResult.data.id;
  }

  const uploadedImages = await uploadImages(supabase, userId, businessId, pendingImages);
  const uploadedLogo = uploadedImages.find((image) => image.kind === "logo");
  const uploadedCover = uploadedImages.find((image) => image.kind === "cover");
  const imageValues = {
    ...(uploadedLogo ? { logo_url: uploadedLogo.publicUrl } : {}),
    ...(uploadedCover ? { cover_image_url: uploadedCover.publicUrl } : {}),
  };
  const needsUpdate = !isNewStorefront || uploadedImages.length > 0;

  if (needsUpdate) {
    const { data, error } = await supabase
      .from("businesses")
      .update({
        ...(isNewStorefront ? {} : values),
        ...imageValues,
        ...(!isNewStorefront && intent === "publish" ? { status: "published" } : {}),
      })
      .eq("id", businessId)
      .eq("owner_id", userId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      if (error) {
        logSupabaseError("update", error, {
          authenticated: true,
          ownerIdFromVerifiedClaims: true,
          status: intent === "publish" ? "published" : isNewStorefront ? "draft" : "unchanged",
          imageUploadCount: String(uploadedImages.length),
        });
      } else {
        console.error("[storefront:write-result] Supabase returned no row after update");
      }

      await removeUploadedObjects(
        supabase,
        uploadedImages.map((image) => image.path),
      );
      storefrontRedirect("error", "The storefront could not be saved. Please try again.");
    }
  }

  const finalLogoUrl = uploadedLogo?.publicUrl ?? oldLogoUrl;
  const finalCoverUrl = uploadedCover?.publicUrl ?? oldCoverUrl;
  const replacedUrls = [uploadedLogo ? oldLogoUrl : null, uploadedCover ? oldCoverUrl : null]
    .filter((url): url is string => Boolean(url))
    .filter((url) => url !== finalLogoUrl && url !== finalCoverUrl);
  const oldPaths = Array.from(
    new Set(
      replacedUrls
        .map(storefrontObjectPathFromPublicUrl)
        .filter(
          (path): path is string =>
            Boolean(path && path.startsWith(`${userId}/${businessId}/`)),
        ),
    ),
  );
  await removeUploadedObjects(supabase, oldPaths);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/storefront");
  revalidatePath(`/artisans/${slug}`);
  if (existingSlug && existingSlug !== slug) {
    revalidatePath(`/artisans/${existingSlug}`);
  }

  if (isNewStorefront) {
    storefrontRedirect(
      "message",
      uploadedImages.length > 0
        ? "Draft storefront and images saved successfully."
        : "Draft storefront created successfully.",
    );
  }

  storefrontRedirect(
    "message",
    intent === "publish"
      ? "Your storefront is now published."
      : uploadedImages.length > 0
        ? "Storefront changes and images saved."
        : "Storefront changes saved.",
  );
}
