import Image from "next/image";
import Link from "next/link";
import { toggleBusinessFollowAction } from "@/app/artisans/actions";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { requireUser } from "@/lib/auth/session";

type FollowedBusiness = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  city: string | null;
  country: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  category: { name: string } | { name: string }[] | null;
};

export default async function FollowingPage() {
  const { supabase, userId } = await requireUser();
  const { data: follows, error: followsError } = await supabase
    .from("business_follows")
    .select("business_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const businessIds = (follows ?? []).map((follow) => follow.business_id as string);
  let businesses: FollowedBusiness[] = [];
  let error = followsError;

  if (!error && businessIds.length > 0) {
    const result = await supabase
      .from("businesses")
      .select("id, name, slug, tagline, description, city, country, cover_image_url, logo_url, category:categories(name)")
      .in("id", businessIds)
      .eq("status", "published");
    error = result.error;
    businesses = (result.data ?? []) as FollowedBusiness[];
  }

  const order = new Map(businessIds.map((id, index) => [id, index]));
  businesses.sort((first, second) => (order.get(first.id) ?? 0) - (order.get(second.id) ?? 0));

  return (
    <section>
      <div className="rounded-[1.35rem] border border-heather/15 bg-white/70 p-6 sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">Community</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl">Seguiti<span className="text-candy">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">I creator e i piccoli brand che hai scelto di tenere vicino.</p>
          </div>
          <Link href="/discover" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-heather px-4 text-xs font-semibold text-white transition-colors hover:bg-[#756486]"><DashboardIcon name="discover" className="size-4" />Scopri creator</Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-candy/20 bg-candy/10 px-5 py-10 text-center text-sm text-ink/75">Non è stato possibile caricare i tuoi seguiti. Riprova tra poco.</div>
        ) : businesses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-heather/25 bg-cream/60 px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-heather/10 text-2xl text-heather" aria-hidden="true">♡</span>
            <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink">Non segui ancora nessuno.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">Esplora i creator di Flowintoone e segui i progetti che ti ispirano.</p>
            <Link href="/discover" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-heather px-6 text-sm font-semibold text-white">Inizia a scoprire</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business) => {
              const category = Array.isArray(business.category) ? business.category[0] : business.category;
              return (
                <article key={business.id} className="overflow-hidden rounded-2xl border border-heather/15 bg-white/80">
                  <Link href={`/artisans/${business.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-sandstone/30">
                      <Image src={business.cover_image_url || "/images/storefront-fallback.svg"} alt={`${business.name} cover`} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {category?.name && <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-heather">{category.name}</p>}
                        <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-ink">{business.name}</h2>
                      </div>
                      <span className="mt-1 text-lg leading-none text-candy" aria-hidden="true">♥</span>
                    </div>
                    {(business.city || business.country) && <p className="mt-2 text-xs font-medium text-ink/65">{[business.city, business.country].filter(Boolean).join(", ")}</p>}
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/65">{business.tagline || business.description || "Scopri il loro lavoro."}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Link href={`/artisans/${business.slug}`} className="text-xs font-semibold text-heather underline decoration-heather/30 underline-offset-4">Visita il sito ↗</Link>
                      <form action={toggleBusinessFollowAction}>
                        <input type="hidden" name="businessId" value={business.id} />
                        <input type="hidden" name="slug" value={business.slug} />
                        <button type="submit" className="rounded-full border border-heather/25 px-3 py-1.5 text-[10px] font-semibold text-ink/70 transition-colors hover:border-heather hover:text-heather">Smetti di seguire</button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
