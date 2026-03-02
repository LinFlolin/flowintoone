import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import DashboardBusiness from "./(dashboard)/DashboardBusiness";
import DashboardUser from "./(dashboard)/DashboardUser";

export default async function Page() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookieStore).getAll(),
        setAll: () => {}, 
      },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;


  if (!user) {
    return (
      <div>
        You are not logged in. <Link href="/authentication">Log in</Link>
      </div>
    );
  }

  // 2) Try to find a membership (optional)
  const { data: membership, error: mErr } = await supabase
    .from("business_memberships")
    .select("business_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (mErr) {
    console.warn("membership error:", mErr.message);
  }

  // Default display name for basic users
  let displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "User";

  // If membership exists, fetch business name and upgrade displayName
  if (membership?.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("name, slug")
      .eq("id", membership.business_id)
      .single();

    if (business?.name) displayName = business.name;
  }

  const isBusinessMember = !!membership?.business_id;

  return (
    <div>
      {isBusinessMember ? (<DashboardBusiness />) : (<DashboardUser />)}
    </div>
  );
}