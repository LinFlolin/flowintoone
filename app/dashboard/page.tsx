import Image from "next/image";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import {
  DASHBOARD_ASSETS,
  DASHBOARD_QUICK_ACCESS,
} from "@/components/dashboard/dashboardConfig";
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
  logo_url: string | null;
  cover_image_url: string | null;
  status: string;
  category: { name: string } | { name: string }[] | null;
};

type DashboardProfile = {
  id: string;
  full_name: string | null;
  avatar_path: string | null;
};

function firstName(value: string | null, email: string | null) {
  return value?.trim().split(/\s+/)[0] || email?.split("@")[0] || "there";
}

function categoryName(category: DashboardBusiness["category"]) {
  return Array.isArray(category) ? category[0]?.name : category?.name;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { supabase, userId, email } = await requireUser();
  const params = await searchParams;
  const [businessResult, profileResult] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id, name, slug, description, city, country, logo_url, cover_image_url, status, category:categories(name)",
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("id, full_name, avatar_path")
      .eq("id", userId)
      .maybeSingle(),
  ]);
  const business = businessResult.data as DashboardBusiness | null;
  const profile = profileResult.data as DashboardProfile | null;
  const category = categoryName(business?.category ?? null);
  const location = [business?.city, business?.country].filter(Boolean).join(", ");
  const publicStorefrontHref =
    business?.status === "published" ? `/artisans/${business.slug}` : null;
  const completionTasks = [
    {
      label: "Create your storefront",
      description: "Give your work a place to live.",
      complete: Boolean(business),
      href: "/dashboard/storefront",
    },
    {
      label: "Add a profile photo",
      description: "Help people put a face to your work.",
      complete: Boolean(profile?.avatar_path),
      href: "/dashboard/profile",
    },
    {
      label: "Upload your logo",
      description: "Make your storefront recognizably yours.",
      complete: Boolean(business?.logo_url),
      href: "/dashboard/storefront",
    },
    {
      label: "Write your story",
      description: "Share what inspires your work.",
      complete: Boolean(business?.description?.trim()),
      href: "/dashboard/storefront",
    },
  ];
  const completedTasks = completionTasks.filter((task) => task.complete).length;
  const progress = `${(completedTasks / completionTasks.length) * 100}%`;

  return (
    <>
      {params.message && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-viridian/25 bg-viridian/10 px-4 py-3 text-sm text-ink"
        >
          {params.message}
        </p>
      )}

      <section className="relative min-h-48 overflow-hidden rounded-[1.75rem] border border-heather/25 bg-sandstone/25 p-7 sm:min-h-52 sm:p-9 2xl:min-h-56 2xl:p-10">
            <Image
              src={DASHBOARD_ASSETS.welcomeBanner}
              alt=""
              fill
              priority
              sizes="(min-width: 1536px) 1400px, (min-width: 1024px) 1100px, 100vw"
              className="object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/70 to-cream/15" />
            <div className="relative max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">
                Good to see you
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl 2xl:text-6xl">
                Welcome back, {firstName(profile?.full_name ?? null, email)}.
              </h1>
              <p className="mt-2 text-base text-ink/60">Your creative space is growing.</p>
              <p className="mt-4 max-w-xl text-base leading-6 text-ink/60">
                Manage your business information and decide when your storefront is ready to
                meet the community.
              </p>
            </div>
      </section>

          {(profileResult.error || !profile) && (
            <p className="mt-4 text-sm leading-5 text-ink/50">
              Your profile details are temporarily unavailable. You can still manage your
              storefront.
            </p>
          )}

          {businessResult.error ? (
            <section className="mt-5 rounded-[1.75rem] border border-candy/25 bg-candy/10 p-7 text-sm leading-6 text-ink">
              <h2 className="text-xl font-semibold">We could not load your storefront.</h2>
              <p className="mt-2 text-ink/65">
                Please refresh the page. If the problem continues, check that the dashboard
                RLS migration has been applied.
              </p>
            </section>
          ) : (
            <>
              <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
                <article className="rounded-[1.75rem] border border-heather/30 bg-white/70 p-7 sm:p-8 2xl:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
                        Storefront summary
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink">
                        {business?.name || "Your storefront"}
                      </h2>
                    </div>
                    {business ? (
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
                          business.status === "published"
                            ? "bg-viridian/15 text-[#477b7b]"
                            : "bg-sandstone/60 text-ink/60"
                        }`}
                      >
                        {business.status}
                      </span>
                    ) : (
                      <span className="rounded-full bg-sandstone/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink/60">
                        Not started
                      </span>
                    )}
                  </div>

                  {business ? (
                    <dl className="mt-5 grid gap-4 border-t border-heather/20 pt-5 md:grid-cols-3">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                          Category
                        </dt>
                        <dd className="mt-1.5 text-sm font-medium text-ink">
                          {category || "Not set"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                          Location
                        </dt>
                        <dd className="mt-1.5 text-sm font-medium text-ink">
                          {location || "Not set"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                          Storefront URL
                        </dt>
                        <dd className="mt-1.5 truncate text-sm font-medium text-heather">
                          /artisans/{business.slug}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-5 border-t border-heather/20 pt-5 text-sm leading-6 text-ink/60">
                      Start with the essentials, then shape a public home for your work.
                    </p>
                  )}

                  <Link
                    href="/dashboard/storefront"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-heather px-5 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
                  >
                    {business ? "Edit storefront" : "Create storefront"}
                    <DashboardIcon name="arrow" className="size-4" />
                  </Link>
                </article>

                <article className="overflow-hidden rounded-[1.75rem] border border-heather/30 bg-white/70 p-3">
                  <div className="flex items-center justify-between gap-3 px-2 pb-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
                      Your storefront
                    </p>
                    {publicStorefrontHref ? (
                      <Link
                        href={publicStorefrontHref}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-heather underline decoration-heather/30 underline-offset-4"
                      >
                        View live site <DashboardIcon name="external" className="size-3" />
                      </Link>
                    ) : (
                      <span className="text-xs font-medium text-ink/40">Draft preview</span>
                    )}
                  </div>
                  <div className="relative aspect-[16/8] overflow-hidden rounded-[1.1rem] bg-sandstone/35">
                    <Image
                      src={business?.cover_image_url || "/images/storefront-fallback.svg"}
                      alt=""
                      fill
                      sizes="(min-width: 1536px) 620px, (min-width: 1024px) 460px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/20 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 flex items-end gap-3">
                      <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-sandstone text-sm font-semibold text-heather shadow-sm">
                        {business?.logo_url ? (
                          <Image
                            src={business.logo_url}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          business?.name?.charAt(0).toUpperCase() || "F"
                        )}
                      </div>
                      <div className="min-w-0 pb-0.5">
                        <p className="truncate text-lg font-semibold tracking-[-0.035em] text-ink">
                          {business?.name || "Your storefront"}
                        </p>
                        <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.12em] text-heather">
                          {category || "Independent maker"}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </section>

              <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Quick access">
                {DASHBOARD_QUICK_ACCESS.map((item) => {
                  const content = (
                    <>
                      <span className={`grid size-9 place-items-center rounded-full ${item.tone}`}>
                        <DashboardIcon name={item.icon} className="size-4" />
                      </span>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">{item.label}</h2>
                        {item.href ? (
                          <DashboardIcon name="arrow" className="size-4 text-heather" />
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink/35">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[15px] leading-6 text-ink/55">{item.description}</p>
                    </>
                  );
                  const className = `min-h-44 rounded-[1.4rem] border border-heather/25 p-6 text-left 2xl:min-h-48 2xl:p-7 ${item.backgroundClassName} ${
                    item.href
                      ? "transition-transform hover:-translate-y-0.5 hover:brightness-[0.98] focus-visible:outline-2"
                      : ""
                  }`;

                  return item.href ? (
                    <Link key={item.label} href={item.href} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <article key={item.label} className={className} aria-label={`${item.label}: coming soon`}>
                      {content}
                    </article>
                  );
                })}
              </section>

              <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.55fr]">
                <article className="rounded-[1.5rem] border border-heather/30 bg-white/70 p-7 2xl:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
                      Complete your space
                    </p>
                    <span className="text-xs font-semibold text-ink/50">
                      {completedTasks} of {completionTasks.length} complete
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-heather/10">
                    <div className="h-full rounded-full bg-heather" style={{ width: progress }} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {completionTasks.map((task) => (
                      <Link key={task.label} href={task.href} className="group flex items-start gap-3 rounded-xl focus-visible:outline-2">
                        <span
                          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                            task.complete ? "bg-heather text-white" : "border border-heather/25 bg-white text-transparent"
                          }`}
                        >
                          <DashboardIcon name="check" className="size-3" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink group-hover:text-heather">
                            {task.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-ink/45">
                            {task.description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <p className="mt-5 border-t border-heather/20 pt-4 text-xs leading-5 text-ink/40">
                    Products will appear here once product management is introduced.
                  </p>
                </article>

                <article className="rounded-[1.5rem] border border-heather/30 bg-white/70 p-7 2xl:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
                      Recent activity
                    </p>
                    <span className="text-xs font-semibold text-ink/35">Coming soon</span>
                  </div>
                  <div className="mt-8 grid min-h-36 place-items-center rounded-2xl bg-cream/70 px-5 text-center">
                    <p className="text-sm leading-6 text-ink/50">
                      Your activity history will appear here when this feature is ready.
                    </p>
                  </div>
                </article>

                <aside className="rounded-[1.5rem] border border-sandstone/70 bg-sandstone/20 p-7 md:col-span-2 xl:col-span-1 2xl:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
                    Word of the day
                  </p>
                  <div className="mt-8">
                    <span className="inline-flex rounded-full bg-white/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink/45">
                      Coming soon
                    </span>
                    <p className="mt-4 text-base leading-6 text-ink/60">
                      A small studio note will live here in a future phase.
                    </p>
                  </div>
                </aside>
              </section>
            </>
          )}
    </>
  );
}
