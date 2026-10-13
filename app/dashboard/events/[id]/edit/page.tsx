import { notFound } from "next/navigation";
import Link from "next/link";
import { EventForm } from "@/components/events/EventForm";
import { getMyEvent } from "@/app/dashboard/events/actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getMyEvent(id);
  if (!event) notFound();

  return (
    <section className="w-full py-4 sm:py-8">
      <Link href="/dashboard/events" className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4">← Torna ai miei eventi</Link>
      <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">Modifica evento</p><h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">{event.title}<span className="text-candy">.</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Mantieni aggiornate le informazioni per aiutare le persone a partecipare.</p></div>
      <div className="mt-8"><EventForm event={event} /></div>
    </section>
  );
}
