import Link from "next/link";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { requireUser } from "@/lib/auth/session";
import { getAccountRole } from "@/lib/auth/roles";

type DashboardPageProps = {
  searchParams: Promise<{ message?: string }>;
};

type DashboardBusiness = {
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  status: string;
  city: string | null;
  category: { name: string } | { name: string }[] | null;
};

type DashboardProfile = {
  full_name: string | null;
  avatar_path: string | null;
};

function firstName(value: string | null, email: string | null) {
  return value?.trim().split(/\s+/)[0] || email?.split("@")[0] || "there";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { supabase, userId, email } = await requireUser();
  const role = await getAccountRole(supabase, userId);
  const params = await searchParams;
  const [businessResult, profileResult] = await Promise.all([
    supabase
      .from("businesses")
      .select("name, slug, description, logo_url, cover_image_url, status, city, category:categories(name)")
      .eq("owner_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("profiles").select("full_name, avatar_path").eq("id", userId).maybeSingle(),
  ]);
  const rawBusiness = businessResult.data as DashboardBusiness | null;
  const relatedCategory = Array.isArray(rawBusiness?.category) ? rawBusiness.category[0] : rawBusiness?.category;
  const business = rawBusiness ? { ...rawBusiness, category: relatedCategory?.name ?? null } : null;
  const profile = profileResult.data as DashboardProfile | null;
  const name = firstName(profile?.full_name ?? null, email);

  if (role === "visitor") {
    return (
      <section className="rounded-[1.35rem] border border-heather/20 bg-white/75 p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">Your dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-ink">Welcome back, {name}.</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-ink/60">Explore independent makers and discover new work. Website creation tools are available to artisan accounts.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-heather px-5 text-sm font-semibold text-white">Explore Flowintoone</Link>
      </section>
    );
  }

  return (
    <DashboardHome
      firstName={name}
      business={business}
      publicStorefrontHref={business?.status === "published" ? `/artisans/${business.slug}` : null}
      profileReady={Boolean(profile?.avatar_path)}
      message={params.message}
    />
  );
}
