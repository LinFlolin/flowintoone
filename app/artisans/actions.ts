"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function toggleBusinessFollowAction(formData: FormData) {
  const businessId = String(formData.get("businessId") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const profilePath = String(formData.get("profilePath") ?? "artisans").trim() === "organizers" ? "organizers" : "artisans";

  if (!UUID_PATTERN.test(businessId) || !SLUG_PATTERN.test(slug) || slug.length > 120) {
    throw new Error("Creator non valido.");
  }

  const { supabase, userId } = await requireUser();
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("id", businessId)
    .eq("status", "published")
    .maybeSingle();

  if (businessError || !business || business.slug !== slug) {
    throw new Error("Questo sito non è disponibile.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("business_follows")
    .select("id")
    .eq("user_id", userId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (existingError) throw new Error("Non è stato possibile aggiornare i seguiti.");

  if (existing) {
    const { error } = await supabase.from("business_follows").delete().eq("id", existing.id);
    if (error) throw new Error("Non è stato possibile smettere di seguire il sito.");
  } else {
    const { error } = await supabase.from("business_follows").insert({
      user_id: userId,
      business_id: businessId,
    });
    if (error) throw new Error("Non è stato possibile seguire il sito.");
  }

  revalidatePath(`/artisans/${slug}`);
  revalidatePath(`/organizers/${slug}`);
  revalidatePath(`/${profilePath}/${slug}`);
  revalidatePath("/dashboard/following");
}
