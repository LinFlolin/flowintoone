import Link from "next/link";
import { EventForm } from "@/components/events/EventForm";
import { requireArtisan } from "@/lib/auth/roles";

export default async function NewEventPage() {
  await requireArtisan();
  return (
    <section className="min-w-0 w-full py-2 sm:py-8">
      <Link href="/dashboard/events" className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4">← Torna ai miei eventi</Link>
      <div className="mt-6 sm:mt-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather sm:text-xs">Nuovo evento</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Crea un evento<span className="text-candy">.</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Aggiungi le informazioni essenziali. Puoi mantenerlo come bozza finché non è pronto.</p></div>
      <div className="mt-6 sm:mt-8"><EventForm /></div>
    </section>
  );
}
