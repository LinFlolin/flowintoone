import Link from "next/link";
import { requireUser } from "@/lib/auth/session";

type DashboardPageProps = {
  searchParams: Promise<{ message?: string }>;
};

type DashboardBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  country: string | null;
  status: string;
  category: { name: string } | { name: string }[] | null;
};

type DashboardProfile = {
  id: string;
  full_name: string | null;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { supabase, userId, email } = await requireUser();
  const params = await searchParams;
  const [businessResult, profileResult] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id, name, slug, description, city, country, status, category:categories(name)",
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("profiles").select("id, full_name").eq("id", userId).maybeSingle(),
  ]);
  const business = businessResult.data as DashboardBusiness | null;
  const profile = profileResult.data as DashboardProfile | null;
  const displayName = profile?.full_name?.trim() || email?.split("@")[0] || null;
  const category = Array.isArray(business?.category)
    ? business.category[0]?.name
    : business?.category?.name;

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      {params.message && (
        <p className="mb-8 rounded-xl border border-viridian/25 bg-viridian/10 px-4 py-3 text-sm text-ink">
          {params.message}
        </p>
      )}

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          Your creative space
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
          Welcome{displayName ? `, ${displayName}` : ""}.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink/65">
          Manage your business information and decide when your storefront is ready to
          meet the community.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard/profile"
            className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
          >
            Edit profile
          </Link>
          {(profileResult.error || !profile) && (
            <span className="text-xs text-ink/50">
              Your profile details are temporarily unavailable.
            </span>
          )}
        </div>
      </section>

      {businessResult.error ? (
        <section className="mt-10 rounded-[2rem] border border-candy/25 bg-candy/10 p-7 sm:p-10">
          <h2 className="text-xl font-semibold text-ink">We could not load your storefront.</h2>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Please refresh the page. If the problem continues, check that the dashboard RLS
            migration has been applied.
          </p>
        </section>
      ) : business ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="rounded-[2rem] border border-heather/15 bg-white/65 p-7 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
                  Business information
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">
                  {business.name}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] ${
                  business.status === "published"
                    ? "bg-viridian/15 text-[#477b7b]"
                    : "bg-sandstone/60 text-ink/70"
                }`}
              >
                {business.status}
              </span>
            </div>

            <dl className="mt-8 grid gap-6 border-t border-heather/10 pt-7 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                  Category
                </dt>
                <dd className="mt-2 text-sm font-medium text-ink">{category || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                  Location
                </dt>
                <dd className="mt-2 text-sm font-medium text-ink">
                  {[business.city, business.country].filter(Boolean).join(", ") || "Not set"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                  Storefront URL
                </dt>
                <dd className="mt-2 text-sm font-medium text-heather">
                  /artisans/{business.slug}
                </dd>
              </div>
            </dl>

            <Link
              href="/dashboard/storefront"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
            >
              Edit storefront
            </Link>
          </article>

          <aside className="rounded-[2rem] bg-sandstone/35 p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
              Publication
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
              {business.status === "published" ? "Your storefront is live." : "Still a draft."}
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/65">
              {business.status === "published"
                ? "Visitors can discover your business from the public maker directory."
                : "Complete the required information, then publish when everything feels ready."}
            </p>
          </aside>
        </section>
      ) : (
        <section className="mt-10 grid min-h-80 place-items-center rounded-[2rem] border border-dashed border-heather/30 bg-white/45 px-6 py-14 text-center">
          <div>
            <span
              className="mx-auto grid size-12 place-items-center rounded-full bg-sandstone/60 text-xl text-heather"
              aria-hidden="true"
            >
              ✦
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-ink">
              Create your first storefront.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
              Add your business story and details. Your storefront will stay private as a
              draft until you choose to publish it.
            </p>
            <Link
              href="/dashboard/storefront"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
            >
              Create your storefront
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
