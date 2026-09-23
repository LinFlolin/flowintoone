import { EventCard } from "@/components/events/EventCard";
import type { HomepageEvent } from "@/lib/data/homepage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type UpcomingEventsProps = {
  events: HomepageEvent[];
  error?: string | null;
};

export function UpcomingEvents({ events, error = null }: UpcomingEventsProps) {
  return (
    <section id="events" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="events-heading">
      <ScrollReveal className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-viridian">
              Prossimi eventi
            </p>
            <h2
              id="events-heading"
              className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl"
            >
              Prossimi eventi<span className="text-candy">.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-ink/75 sm:text-lg">
              Scopri mercati, workshop ed esperienze creative vicino a te.
            </p>
          </div>
          <a href="/events" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4">
            Esplora tutti gli eventi <span aria-hidden="true">→</span>
          </a>
        </div>

        {error ? (
          <div className="mt-12 rounded-[2rem] border border-heather/15 bg-sandstone/20 px-6 py-12 text-center sm:px-10">
            <p className="text-xl font-semibold tracking-[-0.03em] text-ink">
              Non è stato possibile caricare gli eventi.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
              {error} Riprova tra poco.
            </p>
          </div>
        ) : events.length > 0 ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[2rem] border border-heather/15 bg-sandstone/20 px-6 py-12 text-center sm:px-10">
            <p className="text-xl font-semibold tracking-[-0.03em] text-ink">
              Nuove date in arrivo.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
              Mercati ed eventi creativi appariranno qui quando saranno pubblicati.
            </p>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
