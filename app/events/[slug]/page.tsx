import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getEventBySlug } from "@/lib/events/queries";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

const getPublishedEvent = cache((slug: string) => getEventBySlug(slug));

function safeExternalUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function safeEventImageUrl(value: string | null) {
  if (!value) return null;

  try {
    const imageUrl = new URL(value);
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const expectedPrefix = "/storage/v1/object/public/storefront-images/";

    return imageUrl.origin === supabaseUrl.origin && imageUrl.pathname.startsWith(expectedPrefix)
      ? imageUrl.toString()
      : null;
  } catch {
    return null;
  }
}

function eventTypeLabel(value: string) {
  const labels: Record<string, string> = {
    market: "Mercato",
    workshop: "Workshop",
    exhibition: "Mostra",
    fair: "Fiera",
    pop_up: "Pop-up",
    online: "Evento online",
    external_event: "Evento esterno",
  };

  return labels[value.toLowerCase()] ?? value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);

  if (!event) return { title: "Evento non trovato | Flowintoone" };

  return {
    title: `${event.title} | Flowintoone`,
    description:
      event.short_description ||
      event.description?.slice(0, 160) ||
      `Scopri ${event.title} su Flowintoone.`,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);

  if (!event) notFound();

  const imageUrl = safeEventImageUrl(event.image_url);
  const externalUrl = safeExternalUrl(event.external_url);
  const location = [event.location_name, event.city].filter(Boolean).join(", ");
  const mapQuery = [event.address, event.location_name, event.city].filter(Boolean).join(", ");
  const mapUrl = mapQuery
    ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapQuery)}`
    : null;

  return (
    <>
      <Header />
      <main className="bg-cream pb-24 text-ink">
        <section className="px-5 pt-8 sm:px-8 sm:pt-12 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <Link
              href="/events"
              className="inline-flex text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
            >
              ← Torna agli eventi
            </Link>

            <div className="relative mt-7 min-h-72 overflow-hidden rounded-[2rem] bg-sandstone/35 sm:min-h-[28rem]">
              <Image
                src={imageUrl || "/images/events/hero-image.png"}
                alt={imageUrl ? `Copertina di ${event.title}` : ""}
                fill
                priority
                sizes="(min-width: 1280px) 1180px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                    {eventTypeLabel(event.type)}
                  </span>
                  {event.category && (
                    <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                      {event.category}
                    </span>
                  )}
                </div>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
                  {event.title}<span className="text-candy">.</span>
                </h1>
                {event.short_description && (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                    {event.short_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-10 sm:px-8 sm:pt-14 lg:px-10">
          <div className="mx-auto grid max-w-[1080px] gap-8 lg:grid-cols-[1fr_19rem] lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">Dettagli evento</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Tutto quello che c&apos;è da sapere.</h2>
              <div className="mt-7 whitespace-pre-line text-base leading-8 text-ink/75">
                {event.description || "Altri dettagli saranno aggiunti presto."}
              </div>
            </div>

            <aside className="h-fit rounded-[1.75rem] border border-heather/15 bg-white/70 p-6">
              <dl className="grid gap-5 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-heather">Inizio</dt>
                  <dd className="mt-1.5 leading-6 text-ink/75">{formatDate(event.start_at)}</dd>
                </div>
                {event.end_at && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-heather">Fine</dt>
                    <dd className="mt-1.5 leading-6 text-ink/75">{formatDate(event.end_at)}</dd>
                  </div>
                )}
                {location && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-heather">Luogo</dt>
                    <dd className="mt-1.5 leading-6 text-ink/75">{location}</dd>
                    {event.address && <dd className="mt-1 text-xs leading-5 text-ink/55">{event.address}</dd>}
                  </div>
                )}
              </dl>

              <div className="mt-6 grid gap-3">
                {externalUrl && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-between rounded-full bg-heather px-5 text-sm font-semibold text-white"
                  >
                    Sito dell&apos;evento <span aria-hidden="true">↗</span>
                  </a>
                )}
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-between rounded-full border border-heather/20 px-5 text-sm font-semibold text-heather"
                  >
                    Apri la mappa <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
