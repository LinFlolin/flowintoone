import Image from "next/image";

const categories = [
  {
    name: "Ceramics",
    image: "/images/categories/ceramico-flora.png",
    alt: "Pastel handmade ceramic vessels and tableware with flowers",
    accent: "bg-candy",
  },
  {
    name: "Jewelry",
    image: "/images/categories/jewelry.png",
    alt: "Delicate handmade jewelry displayed in a neutral studio setting",
    accent: "bg-azur",
  },
  {
    name: "Textiles",
    image: "/images/categories/textiles.jpg",
    alt: "Ivory textile with delicate botanical embroidery",
    accent: "bg-viridian",
  },
  {
    name: "Art & Prints",
    image: "/images/categories/art-prints.jpg",
    alt: "An artist holding botanical art prints at a work table",
    accent: "bg-heather",
  },
] as const;

export function CategoryGrid() {
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

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((category) => (
            <article key={category.name} className="group">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-sandstone/35 sm:rounded-3xl">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <span className={`size-2 rounded-full ${category.accent}`} aria-hidden="true" />
                <h3 className="text-sm font-semibold text-ink sm:text-base">{category.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
