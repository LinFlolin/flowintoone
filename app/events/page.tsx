import type { Metadata } from "next";
import { EventsPage } from "@/components/events/EventsPage";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getEventDirectory } from "@/lib/data/homepage";

export const metadata: Metadata = {
  title: "Events | Flowintoone",
  description: "Explore published markets, workshops, and creative experiences on Flowintoone.",
};

type EventsRouteProps = {
  searchParams: Promise<{ query?: string; category?: string; city?: string; page?: string; sort?: string }>;
};

export default async function EventsRoute({ searchParams }: EventsRouteProps) {
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const city = params.city?.trim() ?? "";
  const page = Number.parseInt(params.page ?? "1", 10);
  const sort = params.sort === "name" ? "name" : "date";
  const result = await getEventDirectory({ query, category, city, page: Number.isFinite(page) ? page : 1, sort });
  return <><Header /><EventsPage {...result} query={query} category={category} city={city} sort={sort} /><Footer /></>;
}
