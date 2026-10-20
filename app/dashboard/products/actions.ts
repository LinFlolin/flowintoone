"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireArtisan } from "@/lib/auth/roles";
import {
  processStorefrontImage,
  storefrontImagePath,
  storefrontObjectPathFromPublicUrl,
  STOREFRONT_IMAGE_BUCKET,
  StorefrontImageValidationError,
} from "@/lib/storefront/images";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{0,59}$/;

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function redirectWith(type: "error" | "message", value: string): never {
  redirect(`/dashboard/products?${new URLSearchParams({ [type]: value }).toString()}`);
}

function parsePrice(value: string) {
  if (!value) return null;
  const parsed = Number(value.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 10000000) return undefined;
  return Math.round(parsed * 100);
}

function optionalFile(formData: FormData, name: string) {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

async function getOwnedBusiness() {
  const user = await requireArtisan();
  const { data: business, error } = await user.supabase
    .from("businesses")
    .select("id, slug")
    .eq("owner_id", user.userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !business) redirectWith("error", "Crea prima il tuo sito per aggiungere prodotti.");
  return { ...user, business };
}

export async function createProductCategoryAction(formData: FormData) {
  const { supabase, business } = await getOwnedBusiness();
  const name = field(formData, "name");
  if (name.length < 1 || name.length > 80) redirectWith("error", "Il nome della categoria deve contenere da 1 a 80 caratteri.");
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  if (!slug) redirectWith("error", "Scegli un nome valido per la categoria.");
  const { error } = await supabase.from("product_categories").insert({ business_id: business.id, name, slug });
  if (error?.code === "23505") redirectWith("error", "Esiste già una categoria con questo nome.");
  if (error) redirectWith("error", "Non è stato possibile creare la categoria.");
  revalidatePath("/dashboard/products");
  redirectWith("message", "Categoria aggiunta.");
}

export async function createProductAction(formData: FormData) {
  const { supabase, userId, business } = await getOwnedBusiness();
  const code = field(formData, "code").toUpperCase();
  const name = field(formData, "name");
  const description = field(formData, "description");
  const categoryId = field(formData, "categoryId");
  const imageFile = optionalFile(formData, "image");
  const priceCents = parsePrice(field(formData, "price"));

  if (!CODE_PATTERN.test(code)) redirectWith("error", "Il codice prodotto deve usare lettere, numeri, trattini o underscore.");
  if (name.length < 1 || name.length > 140) redirectWith("error", "Il nome prodotto deve contenere da 1 a 140 caratteri.");
  if (description.length > 2000) redirectWith("error", "La descrizione è troppo lunga.");
  if (categoryId && !UUID_PATTERN.test(categoryId)) redirectWith("error", "Categoria non valida.");
  if (priceCents === undefined) redirectWith("error", "Inserisci un prezzo valido.");
  const { count: imageCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id)
    .not("image_url", "is", null);
  if (imageFile && (imageCount ?? 0) >= 8) {
    redirectWith("error", "Hai raggiunto il limite di 8 immagini prodotto per questo piano.");
  }

  if (categoryId) {
    const { data: category } = await supabase.from("product_categories").select("id").eq("id", categoryId).eq("business_id", business.id).maybeSingle();
    if (!category) redirectWith("error", "La categoria selezionata non è disponibile.");
  }

  let imageUrl: string | null = null;
  let uploadedPath: string | null = null;
  if (imageFile) {
    let processed;
    try {
      processed = await processStorefrontImage(imageFile, "product");
    } catch (error) {
      if (error instanceof StorefrontImageValidationError) redirectWith("error", `Immagine prodotto: ${error.message}`);
      redirectWith("error", "L'immagine prodotto non può essere elaborata.");
    }
    uploadedPath = storefrontImagePath(userId, business.id, "product");
    const upload = await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).upload(uploadedPath, processed.bytes, { cacheControl: "31536000", contentType: processed.contentType, upsert: false });
    if (upload.error) redirectWith("error", "Non è stato possibile caricare l'immagine prodotto.");
    imageUrl = supabase.storage.from(STOREFRONT_IMAGE_BUCKET).getPublicUrl(uploadedPath).data.publicUrl;
  }

  const { error } = await supabase.from("products").insert({
    business_id: business.id,
    category_id: categoryId || null,
    code,
    name,
    description: description || null,
    price_cents: priceCents,
    image_url: imageUrl,
    status: field(formData, "status") === "published" ? "published" : "draft",
  });
  if (error?.code === "23505") {
    if (uploadedPath) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([uploadedPath]);
    redirectWith("error", "Esiste già un prodotto con questo codice.");
  }
  if (error) {
    if (uploadedPath) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([uploadedPath]);
    redirectWith("error", "Non è stato possibile salvare il prodotto.");
  }
  revalidatePath("/dashboard/products");
  revalidatePath(`/artisans/${business.slug}`);
  redirectWith("message", "Prodotto aggiunto al catalogo.");
}

export async function updateProductAction(formData: FormData) {
  const { supabase, userId, business } = await getOwnedBusiness();
  const productId = field(formData, "productId");
  const code = field(formData, "code").toUpperCase();
  const name = field(formData, "name");
  const description = field(formData, "description");
  const categoryId = field(formData, "categoryId");
  const imageFile = optionalFile(formData, "image");
  const priceCents = parsePrice(field(formData, "price"));

  if (!UUID_PATTERN.test(productId)) redirectWith("error", "Prodotto non valido.");
  if (!CODE_PATTERN.test(code)) redirectWith("error", "Il codice prodotto deve usare lettere, numeri, trattini o underscore.");
  if (name.length < 1 || name.length > 140) redirectWith("error", "Il nome prodotto deve contenere da 1 a 140 caratteri.");
  if (description.length > 2000) redirectWith("error", "La descrizione è troppo lunga.");
  if (categoryId && !UUID_PATTERN.test(categoryId)) redirectWith("error", "Categoria non valida.");
  if (priceCents === undefined) redirectWith("error", "Inserisci un prezzo valido.");

  const { data: existing } = await supabase
    .from("products")
    .select("id, image_url, status")
    .eq("id", productId)
    .eq("business_id", business.id)
    .maybeSingle();
  if (!existing) redirectWith("error", "Prodotto non trovato.");

  if (categoryId) {
    const { data: category } = await supabase.from("product_categories").select("id").eq("id", categoryId).eq("business_id", business.id).maybeSingle();
    if (!category) redirectWith("error", "La categoria selezionata non è disponibile.");
  }

  let imageUrl = existing.image_url as string | null;
  let uploadedPath: string | null = null;
  if (imageFile) {
    const { count: imageCount } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("business_id", business.id)
      .not("image_url", "is", null)
      .neq("id", productId);
    if ((imageCount ?? 0) >= 8 && !existing.image_url) redirectWith("error", "Hai raggiunto il limite di 8 immagini prodotto per questo piano.");

    let processed;
    try {
      processed = await processStorefrontImage(imageFile, "product");
    } catch (error) {
      if (error instanceof StorefrontImageValidationError) redirectWith("error", `Immagine prodotto: ${error.message}`);
      redirectWith("error", "L'immagine prodotto non può essere elaborata.");
    }
    uploadedPath = storefrontImagePath(userId, business.id, "product");
    const upload = await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).upload(uploadedPath, processed.bytes, { cacheControl: "31536000", contentType: processed.contentType, upsert: false });
    if (upload.error) redirectWith("error", "Non è stato possibile caricare l'immagine prodotto.");
    imageUrl = supabase.storage.from(STOREFRONT_IMAGE_BUCKET).getPublicUrl(uploadedPath).data.publicUrl;
  }

  const { error } = await supabase.from("products").update({
    category_id: categoryId || null,
    code,
    name,
    description: description || null,
    price_cents: priceCents,
    image_url: imageUrl,
  }).eq("id", productId).eq("business_id", business.id);

  if (error?.code === "23505") {
    if (uploadedPath) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([uploadedPath]);
    redirectWith("error", "Esiste già un prodotto con questo codice.");
  }
  if (error) {
    if (uploadedPath) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([uploadedPath]);
    redirectWith("error", "Non è stato possibile aggiornare il prodotto.");
  }

  const oldImagePath = storefrontObjectPathFromPublicUrl(existing.image_url as string | null);
  if (uploadedPath && oldImagePath) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([oldImagePath]);
  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${productId}/edit`);
  revalidatePath(`/artisans/${business.slug}`);
  redirect(`/dashboard/products?message=${encodeURIComponent("Prodotto aggiornato.")}`);
}

export async function toggleProductStatusAction(formData: FormData) {
  const { supabase, business } = await getOwnedBusiness();
  const productId = field(formData, "productId");
  if (!UUID_PATTERN.test(productId)) redirectWith("error", "Prodotto non valido.");
  const { data: product } = await supabase.from("products").select("id, status").eq("id", productId).eq("business_id", business.id).maybeSingle();
  if (!product) redirectWith("error", "Prodotto non trovato.");
  const nextStatus = product.status === "published" ? "draft" : "published";
  const { error } = await supabase.from("products").update({ status: nextStatus }).eq("id", productId).eq("business_id", business.id);
  if (error) redirectWith("error", "Non è stato possibile aggiornare il prodotto.");
  revalidatePath("/dashboard/products");
  revalidatePath(`/artisans/${business.slug}`);
  redirectWith("message", nextStatus === "published" ? "Prodotto pubblicato." : "Prodotto rimesso in bozza.");
}

export async function deleteProductAction(formData: FormData) {
  const { supabase, business } = await getOwnedBusiness();
  const productId = field(formData, "productId");
  if (!UUID_PATTERN.test(productId)) redirectWith("error", "Prodotto non valido.");
  const { data: product } = await supabase.from("products").select("image_url").eq("id", productId).eq("business_id", business.id).maybeSingle();
  const { error } = await supabase.from("products").delete().eq("id", productId).eq("business_id", business.id);
  if (error) redirectWith("error", "Non è stato possibile eliminare il prodotto.");
  const imagePath = storefrontObjectPathFromPublicUrl(product?.image_url ?? null);
  if (imagePath) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([imagePath]);
  revalidatePath("/dashboard/products");
  revalidatePath(`/artisans/${business.slug}`);
  redirectWith("message", "Prodotto eliminato.");
}
