import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { ParticipationActions, ShareEventButton } from "@/components/events/EventDetailActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getEventBySlug, getEventOrganizer } from "@/lib/events/queries";

type EventDetailPageProps = { params: Promise<{ slug: string }> };
type IconName = "calendar" | "clock" | "pin" | "screen" | "spark" | "chevron";

export const revalidate = 300;
const getPublishedEvent = cache((slug: string) => getEventBySlug(slug));

function safeExternalUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

function safeEventImageUrl(value: string | null) {
  if (!value || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const imageUrl = new URL(value);
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const expectedPrefix = "/storage/v1/object/public/storefront-images/";
    return imageUrl.origin === supabaseUrl.origin && imageUrl.pathname.startsWith(expectedPrefix) ? imageUrl.toString() : null;
  } catch { return null; }
}

function eventTypeLabel(value: string) {
  const labels: Record<string, string> = { market: "Mercato", workshop: "Workshop", exhibition: "Mostra", fair: "Fiera", pop_up: "Pop-up", online: "Evento online", external_event: "Evento esterno" };
  return labels[value.toLowerCase()] ?? value;
}

const dateFormatter = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome" });
const weekdayFormatter = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Rome" });
const timeFormatter = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" });

function formatTimeRange(startAt: string, endAt: string | null) {
  const start = timeFormatter.format(new Date(startAt));
  return endAt ? `${start} – ${timeFormatter.format(new Date(endAt))}` : start;
}

function formatPrice(cents: number | null, currency: string) {
  if (cents === null) return "Prezzo da definire";
  if (cents === 0) return "Gratuito";
  try { return new Intl.NumberFormat("it-IT", { style: "currency", currency, maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100); }
  catch { return `€${(cents / 100).toFixed(2)}`; }
}

async function eventHasEnded(endAt: string) {
  return new Date(endAt).getTime() < Date.now();
}

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    calendar: <><path d="M7 3v3M17 3v3M4 9h16" /><rect x="4" y="5" width="16" height="16" rx="2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
    spark: <><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3 2-7Z" /></>,
    chevron: <path d="m7 9 5 5 5-5" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function DetailRow({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  return <div className="flex gap-3.5"><span className="mt-0.5 text-heather"><Icon name={icon} /></span><div className="min-w-0"><dt className="text-xs font-bold text-ink">{label}</dt><dd className="mt-1 text-xs leading-5 text-ink/60">{children}</dd></div></div>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);
  if (!event) return { title: "Evento non trovato | Flowintoone" };
  return { title: `${event.title} | Flowintoone`, description: event.short_description || event.description?.slice(0, 160) || `Scopri ${event.title} su Flowintoone.` };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);
  if (!event) notFound();

  const organizer = await getEventOrganizer(event.created_by);
  const imageUrl = safeEventImageUrl(event.image_url);
  const registrationUrl = safeExternalUrl(event.external_url);
  const isOnline = event.attendance_mode === "online";
  const locationLabel = isOnline ? "Online" : [event.location_name, event.city].filter(Boolean).join(" · ");
  const fullLocation = isOnline ? "Online" : [event.location_name, event.address, event.city].filter(Boolean).join(", ");
  const mapQuery = !isOnline ? [event.address, event.location_name, event.city].filter(Boolean).join(", ") : "";
  const mapUrl = mapQuery ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapQuery)}` : null;
  const isEnded = await eventHasEnded(event.end_at ?? event.start_at);
  const disabledReason = event.is_cancelled ? "L’evento è stato annullato." : isEnded ? "L’evento si è concluso." : event.is_sold_out ? "Non ci sono più posti disponibili." : null;
  const ctaLabel = event.is_cancelled ? "Evento annullato" : isEnded ? "Evento concluso" : event.is_sold_out ? "Posti esauriti" : event.price_cents === 0 ? "Iscriviti" : event.price_cents === null ? "Prenota il tuo posto" : "Acquista il biglietto";
  const usefulItems = [...(event.faq ?? [])];
  if (event.included && !usefulItems.some((item) => item.question.toLowerCase().includes("inclus"))) usefulItems.unshift({ question: "Cosa è incluso?", answer: event.included });
  if (isOnline && event.online_access_info && !usefulItems.some((item) => /online|access/.test(item.question.toLowerCase()))) usefulItems.push({ question: "Come si partecipa online?", answer: event.online_access_info });

  return <>
    <Header />
    <main className="min-h-screen overflow-x-clip bg-cream pb-20 text-ink sm:pb-28">
      <div className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-7 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-3 flex min-w-0 items-center gap-2 text-xs text-ink/45">
          <Link href="/events" className="shrink-0 transition hover:text-heather focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather">Eventi</Link><span aria-hidden="true">/</span><span aria-current="page" className="truncate">{event.title}</span>
        </nav>

        <section aria-labelledby="event-title" className="relative isolate min-h-[27rem] overflow-hidden rounded-[1.35rem] bg-heather sm:min-h-[30rem] lg:min-h-[24rem]">
          <Image src={imageUrl || "/images/events/hero-image.png"} alt={imageUrl ? `Copertina di ${event.title}` : ""} fill priority sizes="(min-width: 1536px) 1344px, 100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#32283e]/95 via-[#3d314b]/60 to-[#3d314b]/10 sm:bg-gradient-to-r sm:from-[#32283e]/95 sm:via-[#3d314b]/65 sm:to-transparent" />
          <div className="relative z-10 flex min-h-[27rem] max-w-4xl flex-col justify-end p-6 text-white sm:min-h-[30rem] sm:p-10 lg:min-h-[24rem] lg:justify-center lg:px-12 lg:py-10">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md">{event.category || eventTypeLabel(event.type)}</span>
              <span className="rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md">{isOnline ? "Online" : "In presenza"}</span>
            </div>
            <h1 id="event-title" className="mt-5 max-w-3xl [overflow-wrap:anywhere] text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">{event.title}</h1>
            {event.short_description && <p className="mt-3 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">{event.short_description}</p>}
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-white/90 sm:text-sm">
              <span className="inline-flex items-center gap-2"><Icon name="calendar" className="size-5" />{dateFormatter.format(new Date(event.start_at))}</span>
              <span className="inline-flex items-center gap-2"><Icon name="clock" className="size-5" />{formatTimeRange(event.start_at, event.end_at)}</span>
              {locationLabel && <span className="inline-flex items-center gap-2"><Icon name={isOnline ? "screen" : "pin"} className="size-5" />{locationLabel}</span>}
            </div>
          </div>
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.75fr)_minmax(20rem,0.85fr)] lg:gap-9 xl:gap-12">
          <div className="order-2 min-w-0 lg:order-1">
            {event.description && <section aria-labelledby="about-event" className="px-1 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-heather">L’evento</p>
              <h2 id="about-event" className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Scopri cosa ti aspetta.</h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-ink/65 sm:text-base sm:leading-8">{event.description}</div>
            </section>}

            {event.features?.length > 0 && <section aria-label="Caratteristiche dell’evento" className={`${event.description ? "mt-6" : ""} flex flex-wrap gap-2 px-1 sm:px-6`}>
              {event.features.map((feature, index) => <span key={`${feature}-${index}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-heather/15 bg-white/55 px-4 text-xs font-semibold text-ink/80"><Icon name="spark" className="size-4 text-candy" />{feature}</span>)}
            </section>}

            {event.agenda?.length > 0 && <section aria-labelledby="event-program" className="mt-9 px-1 sm:px-6">
              <h2 id="event-program" className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">Il programma</h2>
              <ol className="mt-5">
                {event.agenda.map((item, index) => <li key={`${item.time}-${item.title}-${index}`} className="grid grid-cols-[3.25rem_1.25rem_minmax(0,1fr)] gap-2 sm:grid-cols-[4.5rem_1.5rem_minmax(0,1fr)] sm:gap-3">
                  <time className="pt-0.5 text-xs font-medium text-ink/55">{item.time}</time>
                  <span className="relative flex justify-center"><span className="relative z-10 mt-1 size-2.5 rounded-full bg-candy ring-4 ring-cream" />{index < event.agenda.length - 1 && <span className="absolute bottom-0 top-3 w-px bg-candy/35" />}</span>
                  <div className="pb-6"><h3 className="text-sm font-bold text-ink">{item.title}</h3>{item.description && <p className="mt-1 text-xs leading-5 text-ink/55 sm:text-sm">{item.description}</p>}</div>
                </li>)}
              </ol>
            </section>}

            {usefulItems.length > 0 && <section aria-labelledby="useful-info" className="mt-5 overflow-hidden rounded-2xl border border-heather/15 bg-white/55">
              <h2 id="useful-info" className="px-5 py-3 text-base font-semibold tracking-[-0.02em] sm:px-6">Informazioni utili</h2>
              <div className="border-t border-heather/10">
                {usefulItems.map((item, index) => <details key={`${item.question}-${index}`} className="group border-b border-heather/10 last:border-b-0">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-sm font-semibold text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-heather sm:px-6"><span>{item.question}</span><span className="shrink-0 transition-transform group-open:rotate-180"><Icon name="chevron" className="size-4" /></span></summary>
                  <p className="px-5 pb-5 text-sm leading-7 text-ink/65 sm:px-6">{item.answer}</p>
                </details>)}
              </div>
            </section>}
          </div>

          <aside aria-labelledby="participation-title" className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24">
            <div className="rounded-[1.35rem] border border-heather/15 bg-white/75 p-5 shadow-[0_20px_55px_rgba(81,68,91,0.07)] backdrop-blur-sm sm:p-6">
              <div className="flex items-start justify-between gap-4"><div><p id="participation-title" className="text-[10px] font-bold uppercase tracking-[0.18em] text-heather">Partecipa all’evento</p><p className={`mt-3 font-semibold tracking-[-0.045em] ${event.price_cents === null ? "text-2xl" : "text-4xl"}`}>{formatPrice(event.price_cents, event.currency || "EUR")}{event.price_cents !== null && event.price_cents > 0 && <span className="ml-2 text-xs font-medium tracking-normal text-ink/50">/ persona</span>}</p>{event.included && <p className="mt-1 text-xs leading-5 text-ink/55">{event.included}</p>}</div><ShareEventButton title={event.title} /></div>

              {(event.is_cancelled || event.is_sold_out || isEnded) && <div role="status" className="mt-5 rounded-xl border border-candy/20 bg-candy/10 px-4 py-3 text-xs font-semibold text-ink">{disabledReason}</div>}

              <dl className="mt-6 grid gap-5 border-t border-heather/10 pt-5">
                <DetailRow icon="calendar" label="Quando"><span className="capitalize">{weekdayFormatter.format(new Date(event.start_at))}</span> · {formatTimeRange(event.start_at, event.end_at)}</DetailRow>
                {isOnline ? <DetailRow icon="screen" label="Modalità"><span>Evento online</span>{event.online_access_info && <span className="mt-1 block">{event.online_access_info}</span>}</DetailRow> : (fullLocation && <DetailRow icon="pin" label="Dove"><span>{event.location_name || event.city}</span>{event.address && <span className="block">{[event.address, event.city].filter(Boolean).join(" · ")}</span>}{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex font-semibold text-candy underline decoration-candy/25 underline-offset-4 hover:text-[#c94b77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy">Apri la mappa ↗</a>}</DetailRow>)}
              </dl>

              <ParticipationActions title={event.title} slug={event.slug} startAt={event.start_at} endAt={event.end_at} description={event.short_description || event.description} location={fullLocation || null} registrationUrl={registrationUrl} ctaLabel={ctaLabel} disabledReason={disabledReason} />

              {organizer && <div className="mt-6 flex items-center justify-center gap-2 border-t border-heather/10 pt-5 text-xs text-ink/45"><span>Organizzato da</span><Link href={`/artisans/${organizer.slug}`} className="font-bold text-ink hover:text-heather focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather">{organizer.name}</Link></div>}
            </div>
          </aside>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
