"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function toggleProductFavoriteAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  const businessSlug = String(formData.get("businessSlug") ?? "").trim();
  if (!UUID_PATTERN.test(productId) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(businessSlug)) throw new Error("Prodotto non valido.");

  const { supabase, userId } = await requireUser();
  const { data: product } = await supabase.from("products").select("id").eq("id", productId).eq("status", "published").maybeSingle();
  if (!product) throw new Error("Questo prodotto non è disponibile.");
  const { data: existing, error: readError } = await supabase.from("product_favorites").select("id").eq("user_id", userId).eq("product_id", productId).maybeSingle();
  if (readError) throw new Error("Non è stato possibile aggiornare i preferiti.");

  if (existing) {
    const { error } = await supabase.from("product_favorites").delete().eq("id", existing.id);
    if (error) throw new Error("Non è stato possibile rimuovere il preferito.");
  } else {
    const { error } = await supabase.from("product_favorites").insert({ user_id: userId, product_id: productId });
    if (error) throw new Error("Non è stato possibile salvare il preferito.");
  }
  revalidatePath(`/artisans/${businessSlug}`);
  revalidatePath("/dashboard/favorites");
}
