import { createSupabaseServerClient } from "@/api/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardBusiness() {
  const cookieStore = cookies();

  const supabase = createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) redirect("/authentication");

  const { data: membership, error: mErr } = await supabase
    .from("business_memberships")
    .select("business_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

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
    <div className="flex items-center justify-center w-screen h-screen bg-linear-to-b text-Cream z-20 from-[#7217ba]">
      <div className="bg-Cream/80 rounded-lg shadow-lg p-8 flex items-center w-4/5 h-4/5">
        <div className="w-1/6 from-40% to-[#f8f4ec] ">
          
        </div>
        <div className="w-full">
          <h1 className="text-2xl font-bold text-[#7217ba]">{business.name}</h1>
          <p className="text-sm text-gray-600 mt-2">Business Type: {business.business_type}</p>
        </div>
      </div>
    </div>
  );
}