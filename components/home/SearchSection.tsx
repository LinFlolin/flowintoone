type SearchSectionProps = {
  query?: string;
};

export function SearchSection({ query = "" }: SearchSectionProps) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10" aria-labelledby="search-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-viridian">
          Find something special
        </p>
        <h2
          id="search-heading"
          className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl"
        >
          What are you looking for?
        </h2>
        <form className="mt-8" action="/#artisans" method="get" role="search">
          <div className="flex flex-col gap-3 rounded-2xl border border-heather/15 bg-white/75 p-2 sm:flex-row sm:rounded-full">
            <label htmlFor="maker-search" className="sr-only">
              Search artisans, products or cities
            </label>
            <input
              id="maker-search"
              name="query"
              type="search"
              defaultValue={query}
              placeholder="Search artisans, products or cities..."
              className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-ink placeholder:text-ink/45 disabled:cursor-not-allowed disabled:opacity-70 sm:px-5"
            />
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-heather px-7 text-sm font-semibold text-white transition-colors enabled:hover:bg-[#756486] disabled:cursor-not-allowed disabled:opacity-55 sm:rounded-full"
            >
              Search
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-ink/55">
            Search published storefronts by name, city, or category.
          </p>
        </form>
      </div>
    </section>
  );
}
