export type EventSummary = {
  id: string;
  title: string;
  location: string;
  date: string;
  type: "Market" | "Event";
  href: string;
};

type EventCardProps = {
  event: EventSummary;
};

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);

  return (
    <article className="grid grid-cols-[4rem_1fr] gap-5 rounded-2xl border border-heather/15 bg-white/50 p-5 transition-transform duration-300 hover:-translate-y-1">
      <time dateTime={event.date} className="border-r border-heather/15 pr-5 text-center">
        <span className="block text-3xl font-semibold tracking-[-0.04em] text-ink">{day}</span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-[0.14em] text-heather">
          {month}
        </span>
      </time>
      <div>
        <span className="inline-flex rounded-full bg-sandstone/55 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ink/70">
          {event.type}
        </span>
        <h3 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-ink">{event.title}</h3>
        <p className="mt-2 text-sm text-ink/60">{event.location}</p>
        <a
          href={event.href}
          className="mt-4 inline-flex text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4 focus-visible:outline-2"
        >
          View details <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
