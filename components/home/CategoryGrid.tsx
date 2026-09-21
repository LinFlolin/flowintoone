import Image from "next/image";
import Link from "next/link";
import type { HomepageCategory } from "@/lib/data/homepage";

const fallbackImages: Record<string, { src: string; alt: string }> = {
  ceramics: {
    src: "/Ceramics.png",
    alt: "Pastel handmade ceramic vessels and tableware with flowers",
  },
  jewelry: {
    src: "/Jewelry.png",
    alt: "Delicate handmade jewelry displayed in a neutral studio setting",
  },
  textiles: {
    src: "/Textiles.png",
    alt: "Ivory textile with delicate botanical embroidery",
  },
  "art-prints": {
    src: "/images/categories/painted-cards.jpg",
    alt: "An artist holding botanical art prints at a work table",
  },
  "home-living": {
    src: "/Home-Living.png",
    alt: "Handmade homeware arranged with flowers",
  },
  "food-beverage": {
    src: "/Food-Beverage.png",
    alt: "Handmade goods arranged on a table",
  },
};

const accents = ["bg-candy", "bg-azur", "bg-viridian", "bg-heather"];

const featuredCategories = [
  { slug: "ceramics", name: "Ceramics" },
  { slug: "jewelry", name: "Jewelry" },
  { slug: "textiles", name: "Textiles" },
  { slug: "art-prints", name: "Art & Prints" },
  { slug: "home-living", name: "Home & Living" },
  { slug: "food-beverage", name: "Food & Beverage" },
] as const;

type CategoryGridProps = {
  categories: HomepageCategory[];
  error?: string | null;
};

export function CategoryGrid({ categories, error = null }: CategoryGridProps) {
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const displayedCategories = featuredCategories.map((featured) => ({
    ...featured,
    category: categoryBySlug.get(featured.slug) ?? null,
  }));

  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <h2
            id="categories-heading"
            className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl"
          >
            Explore by category<span className="text-candy">.</span>
          </h2>
          <div className="hidden h-px flex-1 bg-heather/15 sm:block" aria-hidden="true" />
          <span className="shrink-0 text-xs font-semibold text-ink/70" aria-disabled="true" title="Coming soon">
            View all categories <span aria-hidden="true">→</span>
          </span>
        </div>

        {error ? (
          <div className="rounded-2xl border border-heather/15 bg-white/45 px-6 py-10 text-center text-sm text-ink/75">
            {error} Please try again soon.
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-6">
            {displayedCategories.map((featured, index) => {
              const category = featured.category;
              const fallback = fallbackImages[featured.slug];
              const imageSrc = category?.imageUrl || fallback?.src;

              const content = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-sandstone/35 sm:rounded-3xl">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={
                          category?.imageUrl
                            ? `${featured.name} handmade creations`
                            : fallback?.alt ?? `${featured.name} handmade creations`
                        }
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-sandstone/25">
                        <span className="text-3xl text-heather/50" aria-hidden="true">
                          ✦
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2.5">
                    <span
                      className={`size-2 rounded-full ${accents[index % accents.length]}`}
                      aria-hidden="true"
                    />
                    <h3 className="text-sm font-semibold text-ink sm:text-base">
                      {featured.name}
                    </h3>
                  </div>
                  {!category && <p className="mt-1 text-[0.65rem] font-semibold text-ink/55">Coming soon</p>}
                </>
              );

              return category ? (
                <Link
                  key={featured.slug}
                  href={`/?category=${encodeURIComponent(category.slug)}#artisans`}
                  className="group block focus-visible:outline-2"
                  aria-label={`Explore ${featured.name} artisans`}
                >
                  {content}
                </Link>
              ) : (
                <div key={featured.slug} className="block opacity-70" aria-disabled="true">
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-heather/25 bg-white/35 px-6 py-10 text-center text-sm text-ink/70">
            Categories will appear here once they are active.
          </div>
        )}
      </div>
    </section>
  );
}
