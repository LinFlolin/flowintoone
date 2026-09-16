import Image from "next/image";
import type { HomepageCategory } from "@/lib/data/homepage";

const fallbackImages: Record<string, { src: string; alt: string }> = {
  ceramics: {
    src: "/images/categories/ceramico-flora.png",
    alt: "Pastel handmade ceramic vessels and tableware with flowers",
  },
  jewelry: {
    src: "/images/categories/jewelry.png",
    alt: "Delicate handmade jewelry displayed in a neutral studio setting",
  },
  textiles: {
    src: "/images/categories/textiles.jpg",
    alt: "Ivory textile with delicate botanical embroidery",
  },
  "art-prints": {
    src: "/images/categories/art-prints.jpg",
    alt: "An artist holding botanical art prints at a work table",
  },
};

const accents = ["bg-candy", "bg-azur", "bg-viridian", "bg-heather"];

type CategoryGridProps = {
  categories: HomepageCategory[];
  error?: string | null;
};

export function CategoryGrid({ categories, error = null }: CategoryGridProps) {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <h2
            id="categories-heading"
            className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl"
          >
            Explore by category<span className="text-candy">.</span>
          </h2>
          <div className="hidden h-px flex-1 bg-heather/15 sm:block" aria-hidden="true" />
        </div>

        {error ? (
          <div className="rounded-2xl border border-heather/15 bg-white/45 px-6 py-10 text-center text-sm text-ink/65">
            {error} Please try again soon.
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((category, index) => {
              const fallback = fallbackImages[category.slug];
              const imageSrc = category.imageUrl || fallback?.src;

              return (
                <article key={category.id} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-sandstone/35 sm:rounded-3xl">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={
                          category.imageUrl
                            ? `${category.name} handmade creations`
                            : fallback.alt
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
                      {category.name}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-heather/25 bg-white/35 px-6 py-10 text-center text-sm text-ink/60">
            Categories will appear here once they are active.
          </div>
        )}
      </div>
    </section>
  );
}
