import "server-only";

import { createClient } from "@/lib/supabase/server";

const EVENT_SELECT =
  "id, created_by, title, slug, description, short_description, type, category, attendance_mode, start_at, end_at, city, location_name, address, external_url, image_url, price_cents, currency, included, features, agenda, faq, online_access_info, is_sold_out, is_cancelled, status, created_at, updated_at";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

export type Event = {
  id: string;
  created_by: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  type: string;
  category: string | null;
  attendance_mode: "in_person" | "online";
  start_at: string;
  end_at: string | null;
  city: string | null;
  location_name: string | null;
  address: string | null;
  external_url: string | null;
  image_url: string | null;
  price_cents: number | null;
  currency: string;
  included: string | null;
  features: string[];
  agenda: EventAgendaItem[];
  faq: EventFaqItem[];
  online_access_info: string | null;
  is_sold_out: boolean;
  is_cancelled: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type EventAgendaItem = {
  time: string;
  title: string;
  description: string | null;
};

export type EventFaqItem = {
  question: string;
  answer: string;
};

export type EventOrganizer = {
  name: string;
  slug: string;
  logoUrl: string | null;
  websitePurpose: string | null;
};

export type SearchEventFilters = {
  text?: string;
  city?: string;
  type?: string;
  /** An ISO calendar date (`YYYY-MM-DD`). */
  date?: string;
  limit?: number;
};

type DateRange = {
  start: string;
  end: string;
};

function utcDate(year: number, monthIndex: number, day: number) {
  const value = new Date(0);
  value.setUTCFullYear(year, monthIndex, day);
  value.setUTCHours(0, 0, 0, 0);
  return value;
}

function limitTo(value: number | undefined) {
  if (!Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(value as number)));
}

function isoDateRange(date: string): DateRange {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new TypeError("date must be an ISO calendar date in YYYY-MM-DD format");
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsed = utcDate(year, month - 1, day);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new TypeError("date must be a valid ISO calendar date");
  }

  const start = `${date}T00:00:00.000Z`;
  const end = utcDate(year, month - 1, day + 1).toISOString();
  return { start, end };
}

function monthRange(year: number, month: number): DateRange {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new TypeError("year must be an integer from 1 to 9999");
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new TypeError("month must be an integer from 1 to 12");
  }

  const start = utcDate(year, month - 1, 1);
  const end = utcDate(year, month, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function cleanSearchTerm(value: string | undefined) {
  return value?.trim().replace(/[%,()]/g, " ").replace(/\s+/g, " ").slice(0, 100) ?? "";
}

function throwQueryError(operation: string, error: { message: string }) {
  throw new Error(`Unable to ${operation}: ${error.message}`);
}

/** Returns published events whose start time is still in the future. */
export async function getUpcomingEvents(limit = DEFAULT_LIMIT): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(limitTo(limit));

  if (error) throwQueryError("load upcoming events", error);
  return (data ?? []) as Event[];
}

/**
 * Returns published events that overlap the requested UTC calendar month.
 * `month` is one-based (January is 1).
 */
export async function getEventsForMonth(year: number, month: number): Promise<Event[]> {
  const { start, end } = monthRange(year, month);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .lt("start_at", end)
    .or(`end_at.is.null,end_at.gte.${start}`)
    .order("start_at", { ascending: true });

  if (error) throwQueryError("load events for month", error);
  return (data ?? []) as Event[];
}

/** Returns every published event that overlaps the requested UTC calendar date. */
export async function getEventsForDate(date: string): Promise<Event[]> {
  const { start, end } = isoDateRange(date);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .lt("start_at", end)
    .or(`end_at.is.null,end_at.gte.${start}`)
    .order("start_at", { ascending: true });

  if (error) throwQueryError("load events for date", error);
  return (data ?? []) as Event[];
}

/** Returns a published event by slug, or null when no such event exists. */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (error) throwQueryError("load event by slug", error);
  return (data as Event | null) ?? null;
}

/** Returns the published storefront belonging to the event owner, when available. */
export async function getEventOrganizer(ownerId: string): Promise<EventOrganizer | null> {
  if (!ownerId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("name, slug, logo_url, website_purpose")
    .eq("owner_id", ownerId)
    .eq("status", "published")
    .limit(1)
    .maybeSingle();

  if (error) throwQueryError("load event organizer", error);
  if (!data) return null;

  return {
    name: data.name,
    slug: data.slug,
    logoUrl: data.logo_url,
    websitePurpose: data.website_purpose,
  };
}

/** Searches published events, optionally constrained by city, type, and a calendar date. */
export async function searchEvents(filters: SearchEventFilters = {}): Promise<Event[]> {
  const text = cleanSearchTerm(filters.text);
  const city = cleanSearchTerm(filters.city);
  const type = cleanSearchTerm(filters.type);
  const dateRange = filters.date ? isoDateRange(filters.date) : null;
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .order("start_at", { ascending: true })
    .limit(limitTo(filters.limit));

  if (text) {
    const pattern = `%${text}%`;
    query = query.or(
      [
        `title.ilike.${pattern}`,
        `description.ilike.${pattern}`,
        `short_description.ilike.${pattern}`,
        `city.ilike.${pattern}`,
        `location_name.ilike.${pattern}`,
        `address.ilike.${pattern}`,
        `type.ilike.${pattern}`,
        `category.ilike.${pattern}`,
      ].join(","),
    );
  }
  if (city) query = query.ilike("city", `%${city}%`);
  if (type) query = query.ilike("type", type);
  if (dateRange) {
    query = query
      .lt("start_at", dateRange.end)
      .or(`end_at.is.null,end_at.gte.${dateRange.start}`);
  }

  const { data, error } = await query;
  if (error) throwQueryError("search events", error);
  return (data ?? []) as Event[];
}
