import { HeaderNavigation } from "@/components/layout/HeaderNavigation";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getAccountRole } from "@/lib/auth/roles";

type HeaderProfile = {
  full_name: string | null;
};

type HeaderStorefront = {
  slug: string;
};

export async function Header() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return <HeaderNavigation />;
  }

  const role = await getAccountRole(user.supabase, user.userId);
  const [profileResult, storefrontResult] = await Promise.all([
    user.supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.userId)
      .maybeSingle(),
    role === "artisan"
      ? user.supabase
      .from("businesses")
      .select("slug")
      .eq("owner_id", user.userId)
      .eq("status", "published")
      .limit(1)
      .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const profile = profileResult.data as HeaderProfile | null;
  const storefront = storefrontResult.data as HeaderStorefront | null;

  return (
    <HeaderNavigation
      user={{
        name: profile?.full_name?.trim() || "My account",
        storefrontHref: storefront ? `/artisans/${storefront.slug}` : null,
      }}
    />
  );
}
