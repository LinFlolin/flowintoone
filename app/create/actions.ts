"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireArtisan } from "@/lib/auth/roles";
import { normalizeStorefrontSlug } from "@/lib/storefront/slug";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function normalizeUrl(value: string) {
  if (!value) return null;
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(normalized);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeEtsyUrl(value: string) {
  const normalized = normalizeUrl(value);
  if (!normalized) return null;
  const hostname = new URL(normalized).hostname.toLowerCase();
  return hostname === "etsy.com" || hostname.endsWith(".etsy.com") || hostname === "etsy.me" || hostname.endsWith(".etsy.me")
    ? normalized
    : null;
}

function fail(message: string): never {
  redirect(`/create/review?error=${encodeURIComponent(message)}`);
}

export async function createWebsiteAction(formData: FormData) {
  const { supabase, userId } = await requireArtisan();
  const purpose = field(formData, "purpose");
  const designModel = field(formData, "designModel");
  const name = field(formData, "name");
  const slug = normalizeStorefrontSlug(field(formData, "slug") || name);
  const description = field(formData, "description");
  const categoryId = field(formData, "categoryId");
  const city = field(formData, "city");
  const country = field(formData, "country");
  const contactEmail = field(formData, "contactEmail").toLowerCase();

  if (!["shop", "events", "portfolio", "services", "personal"].includes(purpose)) {
    fail("Choose a valid website purpose.");
  }
  if (purpose !== "shop" && purpose !== "events") {
    fail("This website type is coming soon. Choose Shop or Events for now.");
  }
  if (designModel !== "editorial" && designModel !== "minimal") fail("Choose a valid design.");
  if (name.length < 2 || name.length > 100) fail("Website name must be between 2 and 100 characters.");
  if (!slug || slug.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("Enter a valid public URL slug.");
  if (!description || description.length > 4000) fail("Add a description of your work.");
  if (!categoryId || !city || !country) fail("Complete the category, city, and country fields.");
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) fail("Enter a valid contact email.");
  if ([field(formData, "websiteUrl"), field(formData, "instagramUrl"), field(formData, "etsyUrl")].some((value) => value.length > 2048)) fail("Links must be 2,048 characters or fewer.");
  if (field(formData, "websiteUrl") && !normalizeUrl(field(formData, "websiteUrl"))) fail("Enter a valid website URL.");
  if (field(formData, "instagramUrl") && !normalizeUrl(field(formData, "instagramUrl"))) fail("Enter a valid Instagram URL.");
  if (field(formData, "etsyUrl") && !normalizeEtsyUrl(field(formData, "etsyUrl"))) fail("Enter a valid Etsy shop URL.");

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle();
  if (categoryError || !category) fail("The selected category is not available.");

  // The product currently supports one website per artisan. This guard also
  // makes a double-click or repeated submission idempotent.
  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", userId)
    .limit(1)
    .maybeSingle();
  if (existing) redirect("/dashboard/storefront?message=Your website already exists.");

  const values = {
    owner_id: userId,
    name,
    slug,
    description,
    category_id: categoryId,
    city,
    country,
    tagline: field(formData, "tagline") || null,
    materials: field(formData, "materials") || null,
    creative_process: field(formData, "creativeProcess") || null,
    website_url: normalizeUrl(field(formData, "websiteUrl")),
    instagram_url: normalizeUrl(field(formData, "instagramUrl")),
    etsy_url: normalizeEtsyUrl(field(formData, "etsyUrl")),
    contact_email: contactEmail || null,
    website_purpose: purpose,
    design_model: designModel,
    status: "draft",
  };

  const { data: business, error } = await supabase
    .from("businesses")
    .insert(values)
    .select("id")
    .maybeSingle();

  if (error || !business) {
    if (error?.code === "23505") fail("That public URL is already in use. Choose another slug.");
    console.error("[create:website] business insert failed", error);
    fail("The website could not be created. Please try again.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/storefront");
  revalidatePath(`/artisans/${slug}`);
  redirect(`/dashboard/storefront?businessId=${business.id}&message=${encodeURIComponent("Draft website created successfully.")}`);
}
