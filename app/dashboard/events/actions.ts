"use server";

import { revalidatePath } from "next/cache";
import { requireArtisan } from "@/lib/auth/roles";
import type { Event } from "@/lib/events/queries";
import {
  processStorefrontImage,
  storefrontImagePath,
  storefrontObjectPathFromPublicUrl,
  STOREFRONT_IMAGE_BUCKET,
  StorefrontImageValidationError,
} from "@/lib/storefront/images";

const EVENT_SELECT =
  "id, created_by, title, slug, description, short_description, type, category, start_at, end_at, city, location_name, address, external_url, image_url, status, created_at, updated_at";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?(?:Z|[+-]\d{2}:?\d{2})$/;

export type EventInput = {
  title: string;
  slug?: string | null;
  type: string;
  start_at: string;
  end_at?: string | null;
  description?: string | null;
  short_description?: string | null;
  category?: string | null;
  city?: string | null;
  location_name?: string | null;
  address?: string | null;
  external_url?: string | null;
  image_url?: string | null;
  cover_image?: File | null;
};

export type EventUpdateInput = Partial<EventInput>;

export type EventActionResult =
  | { success: true; event: Event }
  | { success: false; error: string };

type FieldValue = string | null;
type ValidatedEventValues = {
  title: string;
  slug: string;
  type: string;
  start_at: string;
  end_at: string | null;
  description: FieldValue;
  short_description: FieldValue;
  category: FieldValue;
  city: FieldValue;
  location_name: FieldValue;
  address: FieldValue;
  external_url: FieldValue;
  image_url: FieldValue;
};

function resultError(error: string): EventActionResult {
  return { success: false, error };
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function optionalText(value: unknown, max: number, label: string) {
  if (value === undefined || value === null || value === "") return { value: null, error: null };
  if (typeof value !== "string") return { value: null, error: `${label} is invalid.` };

  const normalized = value.trim();
  if (normalized.length > max) return { value: null, error: `${label} must be at most ${max} characters.` };
  return { value: normalized || null, error: null };
}

function urlValue(value: unknown, label: string, ignoreInvalid = false) {
  const normalized = optionalText(value, 2048, label);
  if (normalized.error || !normalized.value) return normalized;

  try {
    const url = new URL(normalized.value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return ignoreInvalid
        ? { value: null, error: null }
        : { value: null, error: `${label} must be an HTTP or HTTPS URL.` };
    }
    return { value: url.toString(), error: null };
  } catch {
    return ignoreInvalid
      ? { value: null, error: null }
      : { value: null, error: `${label} must be a valid URL.` };
  }
}

function timestampValue(value: unknown, label: string, required: boolean) {
  if (value === undefined || value === null || value === "") {
    return required
      ? { value: null, error: `${label} is required.` }
      : { value: null, error: null };
  }
  if (typeof value !== "string" || !TIMESTAMP_PATTERN.test(value)) {
    return { value: null, error: `${label} must be an ISO timestamp with a timezone.` };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { value: null, error: `${label} is invalid.` };
  return { value: parsed.toISOString(), error: null };
}

function validateEvent(input: Record<string, unknown>):
  | { values: ValidatedEventValues; error: null }
  | { values: null; error: string } {
  const title = text(input.title);
  if (title.length < 2 || title.length > 160) {
    return { values: null, error: "Il titolo deve contenere da 2 a 160 caratteri." };
  }

  const slug = text(input.slug).toLowerCase() || slugify(title) || "evento";
  if (!slug || slug.length > 120 || !SLUG_PATTERN.test(slug)) {
    return { values: null, error: "Lo slug può contenere solo lettere minuscole, numeri e trattini." };
  }

  const type = text(input.type);
  if (!type || type.length > 80) return { values: null, error: "Il tipo di evento è obbligatorio e non può superare 80 caratteri." };

  const start = timestampValue(input.start_at, "La data di inizio", true);
  const end = timestampValue(input.end_at, "La data di fine", false);
  if (start.error) return { values: null, error: start.error };
  if (end.error) return { values: null, error: end.error };
  if (!start.value) return { values: null, error: "La data di inizio è obbligatoria." };
  if (end.value && end.value < start.value) return { values: null, error: "La fine non può precedere l'inizio." };

  const fields = [
    ["description", input.description, 10000],
    ["short_description", input.short_description, 500],
    ["category", input.category, 120],
    ["city", input.city, 120],
    ["location_name", input.location_name, 160],
    ["address", input.address, 300],
  ] as const;
  const optionalValues: Record<string, string | null> = {};
  for (const [key, value, max] of fields) {
    const field = optionalText(value, max, key);
    if (field.error) return { values: null, error: field.error };
    optionalValues[key] = field.value;
  }

  // The external link is optional and must never prevent an event from being
  // saved. Invalid optional values are discarded instead of persisted.
  const externalUrl = urlValue(input.external_url, "Link esterno", true);
  if (externalUrl.error) return { values: null, error: externalUrl.error };
  const imageUrl = urlValue(input.image_url, "Image URL");
  if (imageUrl.error) return { values: null, error: imageUrl.error };

  return {
    values: {
      title,
      slug,
      type,
      start_at: start.value,
      end_at: end.value,
      description: optionalValues.description,
      short_description: optionalValues.short_description,
      category: optionalValues.category,
      city: optionalValues.city,
      location_name: optionalValues.location_name,
      address: optionalValues.address,
      external_url: externalUrl.value,
      image_url: imageUrl.value,
    },
    error: null,
  };
}

function asInput(event: Event): EventInput {
  return {
    title: event.title,
    slug: event.slug,
    type: event.type,
    start_at: event.start_at,
    end_at: event.end_at,
    description: event.description,
    short_description: event.short_description,
    category: event.category,
    city: event.city,
    location_name: event.location_name,
    address: event.address,
    external_url: event.external_url,
    image_url: event.image_url,
  };
}

function validEventId(eventId: string) {
  return typeof eventId === "string" && UUID_PATTERN.test(eventId);
}

async function slugIsTaken(
  supabase: Awaited<ReturnType<typeof requireArtisan>>["supabase"],
  slug: string,
  eventId?: string,
) {
  let query = supabase.from("events").select("id").eq("slug", slug).limit(1);
  if (eventId) query = query.neq("id", eventId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

async function availableEventSlug(
  supabase: Awaited<ReturnType<typeof requireArtisan>>["supabase"],
  requestedSlug: string,
) {
  if (!(await slugIsTaken(supabase, requestedSlug))) return requestedSlug;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = crypto.randomUUID().slice(0, 8);
    const candidate = `${requestedSlug.slice(0, 111).replace(/-+$/g, "")}-${suffix}`;
    if (!(await slugIsTaken(supabase, candidate))) return candidate;
  }

  throw new Error("Unable to generate a unique event slug");
}

async function ownedEvent(
  supabase: Awaited<ReturnType<typeof requireArtisan>>["supabase"],
  eventId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", eventId)
    .eq("created_by", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Event | null) ?? null;
}

function revalidateEventPages(slug?: string) {
  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

async function uploadEventCover(
  supabase: Awaited<ReturnType<typeof requireArtisan>>["supabase"],
  userId: string,
  eventId: string,
  file: File | null | undefined,
) {
  if (!(file instanceof File) || file.size === 0) return { url: null, error: null, path: null };

  try {
    const processed = await processStorefrontImage(file, "cover");
    const path = storefrontImagePath(userId, eventId, "cover");
    const { error } = await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).upload(path, processed.bytes, {
      cacheControl: "31536000",
      contentType: processed.contentType,
      upsert: false,
    });
    if (error) return { url: null, error: "Non è stato possibile caricare la copertina.", path: null };
    const { data } = supabase.storage.from(STOREFRONT_IMAGE_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, error: null, path };
  } catch (error) {
    return {
      url: null,
      error: error instanceof StorefrontImageValidationError ? error.message : "Non è stato possibile elaborare la copertina.",
      path: null,
    };
  }
}

async function removeEventCover(
  supabase: Awaited<ReturnType<typeof requireArtisan>>["supabase"],
  userId: string,
  eventId: string,
  url: string | null,
) {
  const path = storefrontObjectPathFromPublicUrl(url);
  if (!path || !path.startsWith(`${userId}/${eventId}/`)) return;
  const { error } = await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([path]);
  if (error) console.error("[events:image-cleanup] failed", error);
}

async function rollbackCreatedEvent(
  supabase: Awaited<ReturnType<typeof requireArtisan>>["supabase"],
  eventId: string,
  userId: string,
) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("created_by", userId);

  if (error) console.error("[events:create-rollback] event cleanup failed", error);
}

export async function createEvent(input: EventInput): Promise<EventActionResult> {
  const { supabase, userId } = await requireArtisan();
  try {
    const validated = validateEvent((input ?? {}) as Record<string, unknown>);
    if (validated.error || !validated.values) return resultError(validated.error ?? "I dati dell'evento non sono validi.");
    const slug = await availableEventSlug(supabase, validated.values.slug);

    const { data, error } = await supabase
      .from("events")
      .insert({ ...validated.values, slug, created_by: userId, status: "draft" })
      .select(EVENT_SELECT)
      .single();
    if (error || !data) {
      if (error?.code === "23505") return resultError("Questo slug è già utilizzato da un altro evento.");
      console.error("[events:create] event insert failed", error);
      return resultError("Non è stato possibile creare l'evento.");
    }

    let event = data as Event;
    const upload = await uploadEventCover(supabase, userId, event.id, input?.cover_image);
    if (upload.error) {
      await rollbackCreatedEvent(supabase, event.id, userId);
      return resultError(upload.error);
    }
    if (upload.url) {
      const imageResult = await supabase.from("events").update({ image_url: upload.url }).eq("id", event.id).eq("created_by", userId).select(EVENT_SELECT).single();
      if (imageResult.error || !imageResult.data) {
        if (upload.path) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([upload.path]);
        await rollbackCreatedEvent(supabase, event.id, userId);
        return resultError("Non è stato possibile salvare la copertina. La bozza non è stata creata.");
      }
      event = imageResult.data as Event;
    }

    revalidateEventPages(event.slug);
    return { success: true, event };
  } catch (error) {
    console.error("[events:create] action failed", error);
    return resultError("Non è stato possibile creare l'evento.");
  }
}

export async function updateEvent(eventId: string, input: EventUpdateInput): Promise<EventActionResult> {
  const { supabase, userId } = await requireArtisan();
  try {
    if (!validEventId(eventId)) return resultError("L'identificativo dell'evento non è valido.");
    const existing = await ownedEvent(supabase, eventId, userId);
    if (!existing) return resultError("Evento non trovato oppure non hai il permesso di modificarlo.");

    const candidate: EventInput = { ...asInput(existing), ...(input ?? {}) };
    const validated = validateEvent(candidate as unknown as Record<string, unknown>);
    if (validated.error || !validated.values) return resultError(validated.error ?? "I dati dell'evento non sono validi.");
    if (await slugIsTaken(supabase, validated.values.slug, eventId)) {
      return resultError("Questo slug è già utilizzato da un altro evento.");
    }

    const upload = await uploadEventCover(supabase, userId, existing.id, input?.cover_image);
    if (upload.error) return resultError(upload.error);
    const updateValues = upload.url ? { ...validated.values, image_url: upload.url } : validated.values;
    const { data, error } = await supabase
      .from("events")
      .update(updateValues)
      .eq("id", eventId)
      .eq("created_by", userId)
      .select(EVENT_SELECT)
      .single();
    if (error || !data) {
      if (upload.path) await supabase.storage.from(STOREFRONT_IMAGE_BUCKET).remove([upload.path]);
      if (error?.code === "23505") return resultError("Questo slug è già utilizzato da un altro evento.");
      console.error("[events:update] event update failed", error);
      return resultError("Non è stato possibile aggiornare l'evento.");
    }

    if (upload.url && existing.image_url) await removeEventCover(supabase, userId, existing.id, existing.image_url);
    revalidateEventPages(existing.slug);
    if (data.slug !== existing.slug) revalidateEventPages(data.slug);
    return { success: true, event: data as Event };
  } catch (error) {
    console.error("[events:update] action failed", error);
    return resultError("Non è stato possibile aggiornare l'evento.");
  }
}

export async function publishEvent(eventId: string): Promise<EventActionResult> {
  const { supabase, userId } = await requireArtisan();
  try {
    if (!validEventId(eventId)) return resultError("L'identificativo dell'evento non è valido.");
    const existing = await ownedEvent(supabase, eventId, userId);
    if (!existing) return resultError("Evento non trovato oppure non hai il permesso di pubblicarlo.");
    const validated = validateEvent(asInput(existing) as unknown as Record<string, unknown>);
    if (validated.error || !validated.values) {
      return resultError(`Completa l'evento prima di pubblicarlo: ${validated.error ?? "i dati non sono validi."}`);
    }

    const { data, error } = await supabase
      .from("events")
      .update({ status: "published" })
      .eq("id", eventId)
      .eq("created_by", userId)
      .select(EVENT_SELECT)
      .single();
    if (error || !data) {
      console.error("[events:publish] event update failed", error);
      return resultError("Non è stato possibile pubblicare l'evento.");
    }

    revalidateEventPages(existing.slug);
    return { success: true, event: data as Event };
  } catch (error) {
    console.error("[events:publish] action failed", error);
    return resultError("Non è stato possibile pubblicare l'evento.");
  }
}

export async function unpublishEvent(eventId: string): Promise<EventActionResult> {
  const { supabase, userId } = await requireArtisan();
  try {
    if (!validEventId(eventId)) return resultError("L'identificativo dell'evento non è valido.");
    const existing = await ownedEvent(supabase, eventId, userId);
    if (!existing) return resultError("Evento non trovato oppure non hai il permesso di rimetterlo in bozza.");

    const { data, error } = await supabase
      .from("events")
      .update({ status: "draft" })
      .eq("id", eventId)
      .eq("created_by", userId)
      .select(EVENT_SELECT)
      .single();
    if (error || !data) {
      console.error("[events:unpublish] event update failed", error);
      return resultError("Non è stato possibile rimettere l'evento in bozza.");
    }

    revalidateEventPages(existing.slug);
    return { success: true, event: data as Event };
  } catch (error) {
    console.error("[events:unpublish] action failed", error);
    return resultError("Non è stato possibile rimettere l'evento in bozza.");
  }
}

export async function deleteEvent(eventId: string): Promise<
  { success: true } | { success: false; error: string }
> {
  const { supabase, userId } = await requireArtisan();
  try {
    if (!validEventId(eventId)) return resultError("L'identificativo dell'evento non è valido.");
    const existing = await ownedEvent(supabase, eventId, userId);
    if (!existing) return resultError("Evento non trovato oppure non hai il permesso di eliminarlo.");

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .eq("created_by", userId);
    if (error) {
      console.error("[events:delete] event delete failed", error);
      return resultError("Non è stato possibile eliminare l'evento.");
    }

    await removeEventCover(supabase, userId, existing.id, existing.image_url);
    revalidateEventPages(existing.slug);
    return { success: true };
  } catch (error) {
    console.error("[events:delete] action failed", error);
    return resultError("Non è stato possibile eliminare l'evento.");
  }
}

export async function getMyEvents(): Promise<Event[]> {
  const { supabase, userId } = await requireArtisan();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("created_by", userId)
    .order("start_at", { ascending: true });
  if (error) {
    console.error("[events:mine] event query failed", error);
    return [];
  }
  return (data ?? []) as Event[];
}

export async function getMyEvent(eventId: string): Promise<Event | null> {
  if (!validEventId(eventId)) return null;
  const { supabase, userId } = await requireArtisan();

  try {
    return await ownedEvent(supabase, eventId, userId);
  } catch (error) {
    console.error("[events:mine-one] event query failed", error);
    return null;
  }
}
