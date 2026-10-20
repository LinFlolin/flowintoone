"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireArtisan } from "@/lib/auth/roles";

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

function normalizeUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return undefined;
  }
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
  const { supabase, business } = await getOwnedBusiness();
  const code = field(formData, "code").toUpperCase();
  const name = field(formData, "name");
  const description = field(formData, "description");
  const categoryId = field(formData, "categoryId");
  const imageUrl = normalizeUrl(field(formData, "imageUrl"));
  const priceCents = parsePrice(field(formData, "price"));

  if (!CODE_PATTERN.test(code)) redirectWith("error", "Il codice prodotto deve usare lettere, numeri, trattini o underscore.");
  if (name.length < 1 || name.length > 140) redirectWith("error", "Il nome prodotto deve contenere da 1 a 140 caratteri.");
  if (description.length > 2000) redirectWith("error", "La descrizione è troppo lunga.");
  if (categoryId && !UUID_PATTERN.test(categoryId)) redirectWith("error", "Categoria non valida.");
  if (priceCents === undefined) redirectWith("error", "Inserisci un prezzo valido.");
  if (imageUrl === undefined) redirectWith("error", "Inserisci un link immagine valido.");

  if (categoryId) {
    const { data: category } = await supabase.from("product_categories").select("id").eq("id", categoryId).eq("business_id", business.id).maybeSingle();
    if (!category) redirectWith("error", "La categoria selezionata non è disponibile.");
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
  if (error?.code === "23505") redirectWith("error", "Esiste già un prodotto con questo codice.");
  if (error) redirectWith("error", "Non è stato possibile salvare il prodotto.");
  revalidatePath("/dashboard/products");
  revalidatePath(`/artisans/${business.slug}`);
  redirectWith("message", "Prodotto aggiunto al catalogo.");
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
  const { error } = await supabase.from("products").delete().eq("id", productId).eq("business_id", business.id);
  if (error) redirectWith("error", "Non è stato possibile eliminare il prodotto.");
  revalidatePath("/dashboard/products");
  revalidatePath(`/artisans/${business.slug}`);
  redirectWith("message", "Prodotto eliminato.");
}
