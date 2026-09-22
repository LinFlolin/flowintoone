import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { DiscoverPage } from "@/components/discover/DiscoverPage";
import { getHomepageCategories, getPublishedArtisans } from "@/lib/data/homepage";

export const metadata: Metadata = {
  title: "Scopri | Flowintoone",
  description: "Scopri creator indipendenti e siti pubblicati su Flowintoone.",
};

type DiscoverRouteProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

export const revalidate = 300;

export default async function DiscoverRoute({ searchParams }: DiscoverRouteProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = params.sort === "name" ? "name" : "recent";
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const [categories, results] = await Promise.all([
    getHomepageCategories(),
    getPublishedArtisans({ query, category, sort, page }),
  ]);

  return (
    <>
      <Header />
      <DiscoverPage categories={categories} results={results} query={query} category={category} sort={sort} />
      <Footer />
    </>
  );
}
