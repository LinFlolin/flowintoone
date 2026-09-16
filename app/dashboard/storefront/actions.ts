"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { normalizeStorefrontSlug } from "@/lib/storefront/slug";

type SupabaseErrorDetails = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
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

function normalizeOptionalUrl(value: string) {
  if (!value) return { value: null, error: null };

  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(normalized);

    if (!['http:', 'https:'].includes(url.protocol)) {
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

  const businessId = getField(formData, "businessId");
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

  if (businessId) {
    const { data: existingBusiness, error: existingError } = await supabase
      .from("businesses")
      .select("id, status, slug, name")
      .eq("id", businessId)
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
  } else if (intent === "publish") {
    storefrontRedirect("error", "Create the draft before publishing it.");
  }

  const slug =
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

  let result = businessId
    ? await supabase
        .from("businesses")
        .update({ ...values, ...(intent === "publish" ? { status: "published" } : {}) })
        .eq("id", businessId)
        .eq("owner_id", userId)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("businesses")
        .insert({ ...values, owner_id: userId, status: "draft" })
        .select("id")
        .maybeSingle();

  if (!businessId && result.error?.code === "23505") {
    const uniqueSlug = `${slug.slice(0, 71)}-${crypto.randomUUID().slice(0, 8)}`;
    result = await supabase
      .from("businesses")
      .insert({ ...values, slug: uniqueSlug, owner_id: userId, status: "draft" })
      .select("id")
      .maybeSingle();
  }

  if (result.error) {
    logSupabaseError(businessId ? "update" : "insert", result.error, {
      authenticated: true,
      ownerIdFromVerifiedClaims: true,
      status: businessId && intent !== "publish" ? "unchanged" : businessId ? "published" : "draft",
      categoryIdPresent: Boolean(categoryId),
      slugPresent: Boolean(slug),
    });
    storefrontRedirect("error", "The storefront could not be saved. Please try again.");
  }

  if (!result.data) {
    console.error("[storefront:write-result] Supabase returned no row and no error", {
      operation: businessId ? "update" : "insert",
      authenticated: true,
      ownerIdFromVerifiedClaims: true,
    });
    storefrontRedirect("error", "The storefront could not be saved with your account.");
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/storefront");

  if (!businessId) {
    storefrontRedirect("message", "Draft storefront created successfully.");
  }

  storefrontRedirect(
    "message",
    intent === "publish"
      ? "Your storefront is now published."
      : "Storefront changes saved.",
  );
}
