import { createPublicSupabaseClient } from "@/lib/supabase/public";

export type HomepageCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export type HomepageBusiness = {
  id: string;
  slug: string;
  businessName: string;
  category: string | null;
  city: string | null;
  imageSrc: string;
};

export type HomepageEvent = {
  id: string;
  title: string;
  location: string | null;
  date: string;
  type: string;
  href: string;
};

export type HomepageSection<T> = {
  data: T;
  error: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

type BusinessRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  category: { name: string } | { name: string }[] | null;
};

type EventRow = {
  id: string;
  title: string;
  slug: string;
  start_at: string;
  city: string | null;
  location_name: string | null;
  type: string;
  external_url: string | null;
};

function reportQueryError(section: string, error: unknown) {
  const details =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : String(error);

  console.error(`[homepage:${section}] Supabase query failed: ${details}`);
}

export async function getHomepageCategories(): Promise<
  HomepageSection<HomepageCategory[]>
> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      reportQueryError("categories", error);
      return { data: [], error: "Categories are temporarily unavailable." };
    }

    return {
      data: ((data ?? []) as CategoryRow[]).map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        imageUrl: category.image_url,
      })),
      error: null,
    };
  } catch (error) {
    reportQueryError("categories", error);
    return { data: [], error: "Categories are temporarily unavailable." };
  }
}

export async function getHomepageBusinesses(): Promise<
  HomepageSection<HomepageBusiness[]>
> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id, name, slug, city, cover_image_url, logo_url, category:categories(name)",
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      reportQueryError("businesses", error);
      return { data: [], error: "Maker profiles are temporarily unavailable." };
    }

    return {
      data: ((data ?? []) as BusinessRow[]).map((business) => {
        const relatedCategory = Array.isArray(business.category)
          ? business.category[0]
          : business.category;

        return {
          id: business.id,
          slug: business.slug,
          businessName: business.name,
          category: relatedCategory?.name ?? null,
          city: business.city,
          imageSrc: business.cover_image_url ?? "/images/storefront-fallback.svg",
        };
      }),
      error: null,
    };
  } catch (error) {
    reportQueryError("businesses", error);
    return { data: [], error: "Maker profiles are temporarily unavailable." };
  }
}

export async function getHomepageEvents(): Promise<HomepageSection<HomepageEvent[]>> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, title, slug, start_at, city, location_name, type, external_url")
      .eq("status", "published")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(3);

    if (error) {
      reportQueryError("events", error);
      return { data: [], error: "Upcoming events are temporarily unavailable." };
    }

    return {
      data: ((data ?? []) as EventRow[]).map((event) => ({
        id: event.id,
        title: event.title,
        location: [event.location_name, event.city].filter(Boolean).join(", ") || null,
        date: event.start_at,
        type:
          event.type.toLowerCase() === "market"
            ? "Market"
            : event.type.toLowerCase() === "event"
              ? "Event"
              : event.type,
        href: event.external_url || `/events/${event.slug}`,
      })),
      error: null,
    };
  } catch (error) {
    reportQueryError("events", error);
    return { data: [], error: "Upcoming events are temporarily unavailable." };
  }
}

export async function getHomepageData() {
  const [categories, businesses, events] = await Promise.all([
    getHomepageCategories(),
    getHomepageBusinesses(),
    getHomepageEvents(),
  ]);

  return { categories, businesses, events };
}
