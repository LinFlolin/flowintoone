import Link from "next/link";
import { ArtisanCard, type ArtisanSummary } from "@/components/artisans/ArtisanCard";

type ArtisanDirectoryProps = {
  artisans?: ArtisanSummary[];
};

export function ArtisanDirectory({ artisans = [] }: ArtisanDirectoryProps) {
  return (
    <section
      id="artisans"
      className="scroll-mt-24 bg-white/45 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
      aria-labelledby="artisans-heading"
    >
      <div className="mx-auto max-w-[1200px]">
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
          <p className="mt-5 text-base leading-7 text-ink/65 sm:text-lg">
            Discover the people and stories behind handmade creations.
          </p>
        </div>

        {artisans.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.slug} artisan={artisan} />
            ))}
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
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
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
      </div>
    </section>
  );
}
