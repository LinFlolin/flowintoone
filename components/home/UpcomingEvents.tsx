import Link from "next/link";
import { EventCard, type EventSummary } from "@/components/events/EventCard";

type UpcomingEventsProps = {
  events?: EventSummary[];
};

export function UpcomingEvents({ events = [] }: UpcomingEventsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="events-heading">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-viridian">
              Markets & events
            </p>
            <h2
              id="events-heading"
              className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl"
            >
              Where to find us<span className="text-candy">.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-ink/65 sm:text-lg">
              Discover upcoming markets and creative events.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink underline decoration-heather/35 underline-offset-4 transition-colors hover:text-heather focus-visible:outline-2"
          >
            Explore all events <span aria-hidden="true">→</span>
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[2rem] border border-heather/15 bg-sandstone/20 px-6 py-12 text-center sm:px-10">
            <p className="text-xl font-semibold tracking-[-0.03em] text-ink">
              New dates are on their way.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
              Upcoming markets and creative events will appear here once they are
              published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
