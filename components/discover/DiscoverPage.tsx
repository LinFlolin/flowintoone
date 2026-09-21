import Image from "next/image";
import Link from "next/link";
import { RegistrationCTA } from "@/components/home/RegistrationCTA";
import type {
  ArtisanDirectoryResult,
  HomepageCategory,
  HomepageSection,
} from "@/lib/data/homepage";
import { DiscoverCard } from "@/components/discover/DiscoverCard";

type DiscoverPageProps = {
  categories: HomepageSection<HomepageCategory[]>;
  results: ArtisanDirectoryResult;
  query: string;
  category: string;
  sort: "recent" | "name";
};

function hrefFor({
  query,
  category,
  sort,
  page,
}: {
  query?: string;
  category?: string;
  sort?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (category) params.set("category", category);
  if (sort && sort !== "recent") params.set("sort", sort);
  if (page && page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/discover?${search}` : "/discover";
}

export function DiscoverPage({ categories, results, query, category, sort }: DiscoverPageProps) {
  const totalPages = Math.max(1, Math.ceil(results.count / results.pageSize));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 7);

  return (
    <>
      <main className="bg-cream pb-4">
        <section className="relative overflow-hidden px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10">
          <div className="mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-viridian">
                Explore Flowintoone
              </p>
              <h1 className="mt-4 max-w-2xl text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-ink">
                Discover something special<span className="text-candy">.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-ink/75 sm:text-lg sm:leading-8">
                Find creators, independent businesses and places worth exploring.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
              <div className="absolute -right-4 -top-4 size-24 rounded-tr-[3rem] bg-viridian/35" aria-hidden="true" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] rounded-br-[5rem]">
                <Image
                  src="/images/categories/ceramico.jpg"
                  alt="Handmade ceramic mug and vessels in a warm studio"
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative -mt-7 ml-6 flex max-w-sm items-center gap-3 rounded-2xl border border-heather/10 bg-[#fffdf9] px-5 py-4">
                <span className="size-2.5 shrink-0 rounded-full bg-candy" aria-hidden="true" />
                <p className="text-xs font-semibold leading-5 text-ink/85 sm:text-sm">
                  Real people. Meaningful stories. A kinder web.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-10 sm:px-8 lg:px-10" aria-labelledby="discover-search-heading">
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="discover-search-heading" className="sr-only">Search websites</h2>
            <form action="/discover" method="get" role="search">
              <div className="flex flex-col gap-3 rounded-2xl border border-heather/15 bg-white/75 p-2 sm:flex-row sm:rounded-full">
                <label htmlFor="discover-query" className="sr-only">Search websites by name, city or category</label>
                <input
                  id="discover-query"
                  name="query"
                  type="search"
                  defaultValue={query}
                  placeholder="Search websites, creators or cities..."
                  className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-ink placeholder:text-ink/60 sm:px-5"
                />
                {category && <input type="hidden" name="category" value={category} />}
                {sort !== "recent" && <input type="hidden" name="sort" value={sort} />}
                <button type="submit" className="min-h-12 rounded-xl bg-heather px-8 text-sm font-semibold text-white transition-colors hover:bg-[#756486] sm:rounded-full">
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="px-5 pb-14 sm:px-8 lg:px-10" aria-labelledby="discover-results-heading">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" aria-label="Filter by category">
                <Link
                  href={hrefFor({ query, sort })}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${!category ? "border-heather bg-heather text-white" : "border-heather/25 bg-white/55 text-ink hover:border-heather"}`}
                >
                  All
                </Link>
                {categories.data.map((item) => (
                  <Link
                    key={item.id}
                    href={hrefFor({ query, category: item.slug, sort })}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${category === item.slug ? "border-heather bg-heather text-white" : "border-heather/25 bg-white/55 text-ink hover:border-heather"}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <form action="/discover" method="get" className="flex items-center gap-2 text-xs text-ink/70">
                <label htmlFor="discover-sort">Sort by</label>
                <select id="discover-sort" name="sort" defaultValue={sort} className="rounded-full border border-heather/25 bg-white/75 px-3 py-2 font-semibold text-ink outline-none">
                  <option value="recent">Most recent</option>
                  <option value="name">Name A–Z</option>
                </select>
                {query && <input type="hidden" name="query" value={query} />}
                {category && <input type="hidden" name="category" value={category} />}
              </form>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <h2 id="discover-results-heading" className="text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">
                  {results.count} {results.count === 1 ? "website" : "websites"}
                </h2>
                <p className="mt-1 text-sm text-ink/65">Discover a place that feels like yours.</p>
              </div>
              {results.page > 1 && <Link href={hrefFor({ query, category, sort })} className="text-xs font-semibold text-heather underline underline-offset-4">Clear page</Link>}
            </div>

            {results.error ? (
              <div className="mt-8 rounded-2xl border border-heather/15 bg-white/55 px-6 py-14 text-center text-sm text-ink/75">
                {results.error} Please try again soon.
              </div>
            ) : results.data.length > 0 ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.data.map((artisan) => <DiscoverCard key={artisan.id} artisan={artisan} />)}
              </div>
            ) : (
              <div className="mt-8 rounded-[2rem] border border-dashed border-heather/25 bg-white/45 px-6 py-16 text-center">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">Nothing here yet.</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
                  Try a different search or browse all published websites.
                </p>
                <Link href="/discover" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-heather px-6 text-sm font-semibold text-white">
                  Browse all websites
                </Link>
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Discover pagination">
                {results.page > 1 && <Link href={hrefFor({ query, category, sort, page: results.page - 1 })} className="grid size-9 place-items-center rounded-full border border-heather/25 bg-white/60 text-sm text-ink">←</Link>}
                {pageNumbers.map((page) => (
                  <Link key={page} href={hrefFor({ query, category, sort, page })} aria-current={page === results.page ? "page" : undefined} className={`grid size-9 place-items-center rounded-full text-xs font-semibold ${page === results.page ? "bg-heather text-white" : "border border-heather/25 bg-white/60 text-ink"}`}>
                    {page}
                  </Link>
                ))}
                {results.page < totalPages && <Link href={hrefFor({ query, category, sort, page: results.page + 1 })} className="grid size-9 place-items-center rounded-full border border-heather/25 bg-white/60 text-sm text-ink">→</Link>}
              </nav>
            )}
          </div>
        </section>
        <RegistrationCTA />
      </main>
    </>
  );
}
