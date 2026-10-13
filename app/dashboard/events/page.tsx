import Link from "next/link";
import { OwnerEventCard } from "@/components/events/OwnerEventCard";
import { getMyEvents } from "@/app/dashboard/events/actions";

export default async function MyEventsPage() {
  const events = await getMyEvents();

  return (
    <section className="w-full py-4 sm:py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">Il mio spazio · Eventi</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">I miei eventi<span className="text-candy">.</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">Crea, gestisci e pubblica i tuoi eventi.</p></div>
        <Link href="/dashboard/events/new" className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-6 text-sm font-semibold text-white transition-colors hover:bg-[#756486]">+ Crea evento</Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-heather/15 bg-white/65 px-6 py-14 text-center sm:px-10">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-sandstone/45 text-2xl text-heather">✦</div>
          <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink">Non hai ancora creato eventi.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/55">Crea il tuo primo evento e condividilo con la community Flowintoone.</p>
          <Link href="/dashboard/events/new" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white">Crea evento</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">{events.map((event) => <OwnerEventCard key={event.id} event={event} />)}</div>
      )}
    </section>
  );
}
