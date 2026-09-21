import Image from "next/image";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { DASHBOARD_ASSETS, DASHBOARD_QUICK_ACCESS } from "@/components/dashboard/dashboardConfig";

type DashboardHomeProps = {
  firstName: string;
  business: {
    name: string;
    slug: string;
    description: string | null;
    status: string;
    logo_url: string | null;
    cover_image_url: string | null;
    category: string | null;
    city: string | null;
  } | null;
  publicStorefrontHref: string | null;
  profileReady: boolean;
  message?: string;
};

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function DashboardHome({
  firstName,
  business,
  publicStorefrontHref,
  profileReady,
  message,
}: DashboardHomeProps) {
  const setupItems = [
    { label: "Website created", complete: Boolean(business), href: "/dashboard/storefront" },
    { label: "Profile photo added", complete: profileReady, href: "/dashboard/profile" },
    { label: "Website published", complete: business?.status === "published", href: "/dashboard/storefront" },
  ];
  const completeCount = setupItems.filter((item) => item.complete).length;

  return (
    <div className="pb-8">
      <section className="lg:hidden" aria-label="Mobile dashboard overview">
        {message && <p role="status" className="mb-4 rounded-xl border border-viridian/25 bg-viridian/10 px-4 py-3 text-sm text-ink">{message}</p>}
        <p className="text-3xl font-semibold tracking-[-0.05em] text-ink">Welcome back, {firstName}!</p>
        <p className="mt-1 text-sm text-ink/65">Here&apos;s your website at a glance.</p>

        <article className="mt-5 rounded-2xl border border-heather/20 bg-white/75 p-3.5" aria-label="Website summary">
          {business ? (
            <>
              <div className="flex items-center gap-3">
                <div className="relative size-[86px] shrink-0 overflow-hidden rounded-xl bg-sandstone/35">
                  <Image src={business.cover_image_url || "/images/storefront-fallback.svg"} alt="" fill sizes="86px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${business.status === "published" ? "bg-viridian/15 text-[#477b7b]" : "bg-sandstone/50 text-ink/55"}`}>
                    <span className="size-1.5 rounded-full bg-current" />{statusLabel(business.status)}
                  </span>
                  <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.03em] text-ink">{business.name}</h2>
                  <p className="mt-1 truncate text-xs text-ink/60">{[business.category, business.city].filter(Boolean).join(" · ") || "Your Flowintoone website"}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-1 text-xs text-ink/55">{business.description || "Your website is live and ready to share."}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/dashboard/storefront" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-heather px-3 text-xs font-semibold text-white"><DashboardIcon name="edit" className="size-3.5" />Edit website</Link>
                {publicStorefrontHref ? <Link href={publicStorefrontHref} target="_blank" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-heather bg-transparent px-3 text-xs font-semibold text-ink"><DashboardIcon name="external" className="size-3.5" />View site</Link> : <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-ink/10 px-3 text-center text-[10px] font-semibold text-ink/45">Publish to view</span>}
              </div>
            </>
          ) : (
            <div className="p-2">
              <h2 className="text-lg font-semibold text-ink">Your website is not set up yet</h2>
              <p className="mt-1 text-sm text-ink/60">Start with the website editor to create your public space.</p>
              <Link href="/dashboard/storefront" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-heather px-4 text-xs font-semibold text-white">Create website</Link>
            </div>
          )}
        </article>

        <section className="mt-4" aria-labelledby="mobile-quick-actions-title">
          <h2 id="mobile-quick-actions-title" className="text-2xl font-semibold tracking-[-0.04em] text-ink">Quick actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MobileQuickAction label="Appearance" icon="appearance" tone="bg-heather/10" />
            <MobileQuickAction label="Settings" icon="settings" tone="bg-azur/10" />
            <MobileQuickAction label="My website" icon="storefront" href="/dashboard/storefront" tone="bg-viridian/10" />
            <MobileQuickAction label="My account" icon="profile" href="/dashboard/profile" tone="bg-candy/10" />
          </div>
        </section>

        <Link href="/discover" className="mt-3 flex min-h-20 items-center justify-between rounded-2xl border border-sandstone bg-white/65 px-4 text-sm text-ink/55">
          <span>Explore our creative community.</span><span className="text-lg text-heather" aria-hidden="true">→</span>
        </Link>
      </section>

      <div className="hidden lg:block">
      {message && <p role="status" className="mb-5 rounded-xl border border-viridian/25 bg-viridian/10 px-4 py-3 text-sm text-ink">{message}</p>}

      <section className="relative min-h-52 overflow-hidden rounded-[1.35rem] border border-heather/15 bg-white/55 px-6 py-7 sm:px-8 sm:py-8">
        <Image src={DASHBOARD_ASSETS.welcomeBanner} alt="" fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover object-right opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/15" />
        <div className="relative max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[#202043] sm:text-4xl">Welcome back, {firstName}!</h1>
          <p className="mt-2 text-sm text-ink/65 sm:text-base">Manage your website, update your content and grow your presence.</p>
        </div>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_11rem]" aria-label="Website summary">
        <article className="rounded-[1.35rem] border border-heather/15 bg-white/75 p-4 sm:p-5">
          <p className="px-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/45">Website summary</p>
          {business ? (
            <div className="mt-3 grid gap-5 md:grid-cols-[16rem_minmax(0,1fr)]">
              <div className="relative aspect-[1.45] overflow-hidden rounded-xl bg-sandstone/35">
                <Image src={business.cover_image_url || "/images/storefront-fallback.svg"} alt="" fill sizes="320px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">{business.name}</p>
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-[-0.035em] text-[#202043]">{business.name}</h2>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${business.status === "published" ? "bg-viridian/15 text-[#477b7b]" : "bg-sandstone/50 text-ink/55"}`}><span className="size-1.5 rounded-full bg-current" />{statusLabel(business.status)}</span>
                </div>
                <p className="mt-1 truncate text-xs text-heather">flowintoone.com/{business.slug} <span aria-hidden="true">↗</span></p>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink/60">{business.description || "Add a description to tell visitors what makes your work special."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {publicStorefrontHref ? <Link href={publicStorefrontHref} target="_blank" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-heather px-4 text-xs font-semibold text-white hover:bg-[#756486]">View website <DashboardIcon name="external" className="size-3.5" /></Link> : <span className="inline-flex min-h-10 items-center rounded-lg bg-ink/10 px-4 text-xs font-semibold text-ink/45">Publish to view website</span>}
                  <Link href="/dashboard/storefront" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-heather/10 px-4 text-xs font-semibold text-ink hover:bg-heather/20">Edit website <DashboardIcon name="edit" className="size-3.5" /></Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-cream p-5"><h2 className="text-lg font-semibold text-[#202043]">Your website is not set up yet</h2><p className="mt-1 text-sm text-ink/60">Start with the website editor to create your public space.</p><Link href="/dashboard/storefront" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-heather px-4 text-xs font-semibold text-white">Create website <DashboardIcon name="arrow" className="ml-2 size-3.5" /></Link></div>
          )}
        </article>
        <article className="rounded-[1.35rem] border border-heather/15 bg-white/75 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/45">Website status</p>
          <p className="mt-5 text-2xl font-semibold text-[#202043]">{completeCount}/{setupItems.length}</p>
          <p className="mt-1 text-xs leading-5 text-ink/55">Setup items complete</p>
          <div className="mt-5 h-1.5 rounded-full bg-heather/10"><div className="h-full rounded-full bg-heather" style={{ width: `${(completeCount / setupItems.length) * 100}%` }} /></div>
        </article>
      </section>

      <section className="mt-5" aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="text-lg font-semibold tracking-[-0.03em] text-[#202043]">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DASHBOARD_QUICK_ACCESS.map((item) => {
            const content = <><span className={`grid size-9 place-items-center rounded-full ${item.tone}`}><DashboardIcon name={item.icon} className="size-4" /></span><div className="mt-4 flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-[#202043]">{item.label}</h3>{item.href ? <DashboardIcon name="arrow" className="size-4 text-ink" /> : <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-ink/40">Coming soon</span>}</div><p className="mt-1 text-xs leading-5 text-ink/60">{item.description}</p></>;
            const className = `min-h-28 rounded-xl border border-heather/10 p-4 text-left ${item.backgroundClassName} ${item.href ? "transition-transform hover:-translate-y-0.5" : "opacity-80"}`;
            return item.href ? <Link key={item.label} href={item.href} className={className}>{content}</Link> : <article key={item.label} className={className} aria-label={`${item.label}: coming soon`}>{content}</article>;
          })}
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.62fr]">
        <article className="rounded-[1.35rem] border border-heather/15 bg-white/75 p-5">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-[#202043]">Website setup</h2><Link href="/dashboard/storefront" className="text-xs font-semibold text-heather">View details →</Link></div>
          <div className="mt-4 grid gap-3">{setupItems.map((item) => <Link key={item.label} href={item.href} className="flex items-center gap-3 text-sm"><span className={`grid size-7 place-items-center rounded-full ${item.complete ? "bg-viridian/15 text-[#477b7b]" : "bg-sandstone/45 text-ink/35"}`}>{item.complete ? "✓" : "○"}</span><span className={item.complete ? "text-ink/65" : "font-medium text-ink"}>{item.label}</span></Link>)}</div>
        </article>
        <article className="rounded-[1.35rem] border border-heather/15 bg-white/75 p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-[#202043]">Need help?</h2><span className="text-ink/60">→</span></div><div className="mt-4 grid gap-3"><Link href="/dashboard/storefront" className="flex items-center gap-3 text-xs text-ink/70"><span className="grid size-8 place-items-center rounded-full bg-heather/10 text-heather">?</span><span><strong className="block text-ink">View guides</strong>Manage your website</span></Link><Link href="/dashboard/profile" className="flex items-center gap-3 text-xs text-ink/70"><span className="grid size-8 place-items-center rounded-full bg-azur/15 text-[#537da9]">@</span><span><strong className="block text-ink">Visit your account</strong>Update your details</span></Link><div className="flex items-center gap-3 text-xs text-ink/45"><span className="grid size-8 place-items-center rounded-full bg-candy/10">✉</span><span><strong className="block text-ink/60">Contact support</strong>Coming soon</span></div></div></article>
        <aside className="relative min-h-48 overflow-hidden rounded-[1.35rem] border border-sandstone/60 bg-sandstone/25 p-5"><Image src={DASHBOARD_ASSETS.welcomeBanner} alt="" fill sizes="300px" className="object-cover opacity-40" /><div className="absolute inset-0 bg-gradient-to-t from-cream/95 via-cream/65 to-transparent" /><div className="relative mt-16"><h2 className="text-base font-semibold leading-5 text-[#202043]">Build a meaningful presence.</h2><p className="mt-2 text-xs leading-5 text-ink/60">Share your craft and connect with your community.</p><span className="mt-3 inline-block text-xs font-semibold text-heather">Flowintoone</span></div></aside>
      </section>
      </div>
    </div>
  );
}

function MobileQuickAction({
  label,
  icon,
  href,
  tone,
}: {
  label: string;
  icon: "appearance" | "settings" | "storefront" | "profile";
  href?: string;
  tone: string;
}) {
  const content = <><DashboardIcon name={icon} className="size-5 text-ink/75" /><span className="mt-3 block text-sm font-semibold text-ink">{label}</span>{!href && <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.08em] text-ink/40">Coming soon</span>}</>;
  const className = `min-h-20 rounded-xl border border-heather/10 p-3.5 ${tone} ${href ? "transition-transform hover:-translate-y-0.5" : "opacity-80"}`;
  return href ? <Link href={href} className={className}>{content}</Link> : <div className={className} aria-disabled="true">{content}</div>;
}
