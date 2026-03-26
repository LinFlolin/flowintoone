// app/create-profile/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/api/server";
import Createbuisiness from "./components/Createbuisiness";

export default async function CreateProfilePage() {
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("created_by", user.id)
    .maybeSingle();

  if (businessError) {
    throw new Error(businessError.message);
  }

  if (business?.business_type === "supplier" || business?.business_type === "shop") {
    const { data: supplierProfile, error: supplierError } = await supabase
      .from("supplier_profiles")
      .select("id")
      .eq("business_id", business.id)
      .maybeSingle();

    if (supplierError) {
      throw new Error(supplierError.message);
    }

    if (business?.business_type === "supplier") {
      redirect("/create-profile/supplier");
    }else if (business?.business_type === "shop") {
      redirect("/create-profile/shop");
    }
  
  }

  return (
    <Createbuisiness/>
  );

}