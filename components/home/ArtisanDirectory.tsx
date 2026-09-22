import Link from "next/link";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import type { HomepageBusiness } from "@/lib/data/homepage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type ArtisanDirectoryProps = {
  artisans: HomepageBusiness[];
  error?: string | null;
  query?: string;
  category?: string;
};

export function ArtisanDirectory({
  artisans,
  error = null,
  query,
  category,
}: ArtisanDirectoryProps) {
  const hasFilter = Boolean(query?.trim() || category?.trim());

  return (
    <section
      id="artisans"
      className="scroll-mt-24 bg-white/45 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
      aria-labelledby="artisans-heading"
    >
      <ScrollReveal className="mx-auto max-w-[1500px]">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-heather">
            Our community
          </p>
          <h2
            id="artisans-heading"
            className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl"
          >
            Meet our makers<span className="text-candy">.</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/75 sm:text-lg">
            Discover the people and stories behind unique creations.
          </p>
          {hasFilter && (
            <p className="mt-4 text-sm font-medium text-heather">
              Showing published storefronts matching your search.
              <Link
                href="/#artisans"
                className="ml-2 underline decoration-heather/35 underline-offset-4"
              >
                Clear filters
              </Link>
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <Link href="/#artisans" className="text-xs font-semibold text-ink/70 underline decoration-heather/35 underline-offset-4">
            View all makers <span aria-hidden="true">→</span>
          </Link>
        </div>

        {error ? (
          <div className="mt-12 rounded-[2rem] border border-heather/15 bg-cream px-6 py-14 text-center">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
              We could not load our makers.
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink/70">{error} Please try again soon.</p>
          </div>
        ) : artisans.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
            <Link
              href="/#artisans"
              className="group flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-heather/15 bg-sandstone/45 p-5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2"
              aria-label="Explore all makers"
            >
              <div>
                <div className="mb-6 flex h-24 items-center justify-center rounded-xl bg-cream/80">
                  <span className="text-5xl leading-none text-heather/70" aria-hidden="true">◒</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em] text-ink">
                  Many stories.<br />One community.
                </h3>
                <p className="mt-3 text-xs leading-5 text-ink/70">
                  More independent makers to explore, support and be inspired by.
                </p>
              </div>
              <span className="mt-5 text-xs font-semibold text-ink underline decoration-heather/35 underline-offset-4">
                Explore all makers <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid min-h-72 place-items-center rounded-[2rem] border border-dashed border-heather/30 bg-cream px-6 py-14 text-center">
            <div>
              <span
                className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-sandstone/60 text-xl text-heather"
                aria-hidden="true"
              >
                ✦
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.035em] text-ink">
                New makers are joining soon.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
                Are you an independent artisan? Be among the first to share your work
                with the Flowintoone community.
              </p>
              <Link
                href="/register"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
              >
                Create your storefront
              </Link>
            </div>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
