"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/api/server";

export async function createBusiness(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const businessType = String(formData.get("business_type") || "").trim();

  if (!name || !slug || !businessType) {
    throw new Error("Please fill in all fields.");
  }

  if (!["shop", "supplier"].includes(businessType)) {
    throw new Error("Invalid business type.");
  }

  // Check if this user already owns/created a business
  const { data: existingBusiness, error: existingBusinessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("created_by", user.id)
    .maybeSingle();

  if (existingBusinessError) {
    throw new Error(existingBusinessError.message);
  }


  // Optional: check slug uniqueness
  const { data: existingSlug, error: slugError } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugError) {
    throw new Error(slugError.message);
  }

  if (existingSlug) {
    throw new Error("Slug already in use.");
  }

  // 1. Insert into businesses
  const { data: newBusiness, error: insertBusinessError } = await supabase
    .from("businesses")
    .insert({
      name,
      slug,
      business_type: businessType,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertBusinessError) {
    throw new Error(`Business insert failed: ${insertBusinessError.message}`);
  }

  // 2. Insert into business_memberships
  const { error: insertMembershipError } = await supabase
    .from("business_memberships")
    .insert({
      business_id: newBusiness.id,
      user_id: user.id,
      role: "owner",
    });

  if (insertMembershipError) {
    throw new Error(`Membership insert failed: ${insertMembershipError.message}`);
  }

}