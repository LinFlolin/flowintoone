import { createSupabaseServerClient } from "../server";
const supabase = await createSupabaseServerClient();

export async function getBusinessByUserId(userId: string) {
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("created_by", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return business;
}

export async function createBusiness(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const businessType = formData.get("business_type") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: existingBusiness, error: existingError } = await supabase
    .from("businesses")
    .select("*")
    .eq("created_by", user.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingBusiness) {
    throw new Error("User already has a business");
  }

  const { data: newBusiness, error } = await supabase
    .from("businesses")
    .insert({
      name,
      slug,
      business_type: businessType,
      created_by: user.id,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return newBusiness;
}