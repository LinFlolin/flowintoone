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
  country: string | null;
  description: string | null;
  imageSrc: string;
};

export type HomepageEvent = {
  id: string;
  title: string;
  location: string | null;
  date: string;
  type: string;
  href: string | null;
};

export type HomepageSection<T> = {
  data: T;
  error: string | null;
};

export type ArtisanDirectoryFilters = {
  query?: string;
  category?: string;
  city?: string;
  page?: number;
  sort?: "recent" | "name";
};

export type ArtisanDirectoryResult = HomepageSection<HomepageBusiness[]> & {
  count: number;
  page: number;
  pageSize: number;
};

export const ARTISAN_DIRECTORY_PAGE_SIZE = 12;

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
  country: string | null;
  tagline: string | null;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  category: { name: string; slug: string } | { name: string; slug: string }[] | null;
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

export async function getHomepageBusinesses(filters: {
  query?: string;
  category?: string;
} = {}): Promise<
  HomepageSection<HomepageBusiness[]>
> {
  try {
    const supabase = createPublicSupabaseClient();
    const categorySlug = filters.category?.trim().toLowerCase().slice(0, 80);
    const searchTerm = filters.query
      ?.trim()
      .replace(/[%,()]/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 80);
    const select = categorySlug
      ? "id, name, slug, city, country, tagline, description, cover_image_url, logo_url, category:categories!inner(name, slug)"
      : "id, name, slug, city, country, tagline, description, cover_image_url, logo_url, category:categories(name, slug)";

    let businessesQuery = supabase
      .from("businesses")
      .select(select)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);

    if (categorySlug) {
      businessesQuery = businessesQuery.eq("category.slug", categorySlug);
    }

    if (searchTerm) {
      const pattern = `%${searchTerm}%`;
      businessesQuery = businessesQuery.or(
        [
          `name.ilike.${pattern}`,
          `city.ilike.${pattern}`,
          `country.ilike.${pattern}`,
          `tagline.ilike.${pattern}`,
          `description.ilike.${pattern}`,
        ].join(","),
      );
    }

    const { data, error } = await businessesQuery;

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
          country: business.country,
          description: business.tagline ?? business.description,
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

export async function getPublishedArtisanCities(): Promise<HomepageSection<string[]>> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("city")
      .eq("status", "published")
      .not("city", "is", null)
      .limit(1000);

    if (error) {
      reportQueryError("artisan-cities", error);
      return { data: [], error: "Cities are temporarily unavailable." };
    }

    const cities = Array.from(
      new Set(
        (data ?? [])
          .map((business) => (typeof business.city === "string" ? business.city.trim() : ""))
          .filter(Boolean),
      ),
    ).sort((first, second) => first.localeCompare(second));

    return { data: cities, error: null };
  } catch (error) {
    reportQueryError("artisan-cities", error);
    return { data: [], error: "Cities are temporarily unavailable." };
  }
}

export async function getPublishedArtisans(
  filters: ArtisanDirectoryFilters = {},
): Promise<ArtisanDirectoryResult> {
  const page = Number.isInteger(filters.page) && filters.page && filters.page > 0 ? filters.page : 1;
  let categorySlug = filters.category?.trim().toLowerCase().slice(0, 80);
  const city = filters.city?.trim().slice(0, 120);
  const searchTerm = filters.query
    ?.trim()
    .replace(/[%,()]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);
  const from = (page - 1) * ARTISAN_DIRECTORY_PAGE_SIZE;
  const to = from + ARTISAN_DIRECTORY_PAGE_SIZE - 1;

  try {
    const supabase = createPublicSupabaseClient();

    if (!categorySlug && searchTerm) {
      const { data: matchingCategory } = await supabase
        .from("categories")
        .select("slug")
        .eq("is_active", true)
        .or(`slug.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
        .limit(1)
        .maybeSingle();

      categorySlug = matchingCategory?.slug ?? undefined;
    }

    const select = categorySlug
      ? "id, name, slug, city, country, tagline, description, cover_image_url, logo_url, category:categories!inner(name, slug)"
      : "id, name, slug, city, country, tagline, description, cover_image_url, logo_url, category:categories(name, slug)";
    const sort = filters.sort === "name" ? "name" : "created_at";
    let artisansQuery = supabase
      .from("businesses")
      .select(select, { count: "exact" })
      .eq("status", "published")
      .order(sort, { ascending: sort === "name" })
      .range(from, to);

    if (categorySlug) {
      artisansQuery = artisansQuery.eq("category.slug", categorySlug);
    }

    if (city) {
      artisansQuery = artisansQuery.eq("city", city);
    }

    if (searchTerm) {
      const pattern = `%${searchTerm}%`;
      artisansQuery = artisansQuery.or(
        [
          `name.ilike.${pattern}`,
          `city.ilike.${pattern}`,
          `country.ilike.${pattern}`,
          `tagline.ilike.${pattern}`,
          `description.ilike.${pattern}`,
        ].join(","),
      );
    }

    const { data, error, count } = await artisansQuery;

    if (error) {
      reportQueryError("artisan-directory", error);
      return {
        data: [],
        count: 0,
        page,
        pageSize: ARTISAN_DIRECTORY_PAGE_SIZE,
        error: "Maker profiles are temporarily unavailable.",
      };
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
          country: business.country,
          description: business.tagline ?? business.description,
          imageSrc: business.cover_image_url ?? "/images/storefront-fallback.svg",
        };
      }),
      count: count ?? 0,
      page,
      pageSize: ARTISAN_DIRECTORY_PAGE_SIZE,
      error: null,
    };
  } catch (error) {
    reportQueryError("artisan-directory", error);
    return {
      data: [],
      count: 0,
      page,
      pageSize: ARTISAN_DIRECTORY_PAGE_SIZE,
      error: "Maker profiles are temporarily unavailable.",
    };
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
        href: event.external_url,
      })),
      error: null,
    };
  } catch (error) {
    reportQueryError("events", error);
    return { data: [], error: "Upcoming events are temporarily unavailable." };
  }
}

export async function getHomepageData(filters: { query?: string; category?: string } = {}) {
  const [categories, businesses, events] = await Promise.all([
    getHomepageCategories(),
    getHomepageBusinesses(filters),
    getHomepageEvents(),
  ]);

  return { categories, businesses, events };
}
