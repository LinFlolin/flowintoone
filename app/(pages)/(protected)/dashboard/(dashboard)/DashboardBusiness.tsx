import { createSupabaseServerClient } from "@/api/server";
import { redirect } from "next/navigation";
import FormUi from "../FormUi";
import BusinessDashboardClient from "./(BusinessDashboardClient)/BusinessDashboardClient";

export default async function DashboardBusiness() {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) redirect("/authentication");

 const [{ data: profileUser }, { data: membership, error: mErr }] =
  await Promise.all([
    supabase.from("profiles").select("avatar_url, full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("business_memberships")
      .select("business_id, role")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (mErr) return <div>Error: {mErr.message}</div>;

  if (!membership?.business_id) {
    return (
      <div>
        <p>You are logged in, but you don't belong to a business yet.</p>
      </div>
    );
  }

  const { data: business, error: bErr } = await supabase
    .from("businesses")
    .select("id, name, business_type, slug")
    .eq("id", membership.business_id)
    .single();

  if (bErr) return <div>Error: {bErr.message}</div>;

  let profile: any = null;

  if (business.business_type === "supplier") {
    const { data } = await supabase
      .from("supplier_profiles")
      .select("*")
      .eq("business_id", business.id)
      .maybeSingle();
    profile = data;
  } else if (business.business_type === "shop") {
    const { data } = await supabase
      .from("shop_profiles")
      .select("*")
      .eq("business_id", business.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <FormUi>
      <BusinessDashboardClient
        business={business}
        profile={profile}
        avatarUrl={profileUser?.avatar_url ?? null}
        fullName={profileUser?.full_name ?? null}
      />
    </FormUi>
  );
}