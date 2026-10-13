"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Event } from "@/lib/events/queries";
import { deleteEvent, publishEvent, unpublishEvent } from "@/app/dashboard/events/actions";

const TYPE_LABELS: Record<string, string> = {
  market: "Mercato",
  workshop: "Workshop",
  exhibition: "Mostra",
  fair: "Fiera",
  pop_up: "Pop-up",
  online: "Evento online",
  external_event: "Evento esterno",
};

const TYPE_IMAGES: Record<string, string> = {
  market: "/images/events/markets.png",
  workshop: "/images/events/creating-pot.png",
  exhibition: "/images/events/hero-image.png",
};

function dateLabel(value: string | null, withYear = true) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) }).format(date);
}

export function OwnerEventCard({ event }: { event: Event }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isPublished = event.status === "published";
  const image = event.image_url || TYPE_IMAGES[event.type] || "/images/events/hero-image.png";

  function mutate(action: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) setError(result.error ?? "Qualcosa è andato storto.");
      else router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(`Eliminare “${event.title}”? Questa azione non può essere annullata.`)) return;
    mutate(() => deleteEvent(event.id));
  }

  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-heather/15 bg-white/75 shadow-[0_8px_30px_rgba(81,68,91,0.04)]">
      <div className="grid sm:grid-cols-[10rem_minmax(0,1fr)]">
        <div className="relative min-h-36 bg-sandstone/40 sm:min-h-full">
          <Image src={image} alt="" fill sizes="(min-width: 640px) 160px, 100vw" className="object-cover" />
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isPublished ? "bg-viridian/90 text-white" : "bg-sandstone/95 text-ink/70"}`}>{isPublished ? "Pubblicato" : "Bozza"}</span>
        </div>
        <div className="min-w-0 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-heather">{TYPE_LABELS[event.type] ?? "Evento"}</p><h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-ink sm:text-xl">{event.title}</h2></div>
            <Link href={`/dashboard/events/${event.id}/edit`} className="inline-flex min-h-9 items-center rounded-full border border-heather/20 px-3 text-xs font-semibold text-heather hover:bg-heather/10">Modifica</Link>
          </div>
          <div className="mt-4 grid gap-1 text-xs text-ink/65 sm:grid-cols-2">
            <p><span className="mr-1 text-heather">◷</span>{dateLabel(event.start_at) ?? "Data da definire"}{event.end_at ? ` – ${dateLabel(event.end_at)}` : ""}</p>
            {(event.location_name || event.city) && <p><span className="mr-1 text-heather">⌖</span>{[event.location_name, event.city].filter(Boolean).join(", ")}</p>}
          </div>
          {error && <p role="alert" className="mt-3 text-xs text-candy">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            {isPublished ? <><Link href={`/events/${event.slug}`} className="inline-flex min-h-9 items-center rounded-full bg-heather px-4 text-xs font-semibold text-white">Vedi evento pubblico ↗</Link><button type="button" disabled={pending} onClick={() => mutate(() => unpublishEvent(event.id))} className="inline-flex min-h-9 items-center rounded-full border border-viridian/30 px-4 text-xs font-semibold text-[#477b7b] hover:bg-viridian/10 disabled:opacity-50">{pending ? "Attendi…" : "Rimetti in bozza"}</button></> : <button type="button" disabled={pending} onClick={() => mutate(() => publishEvent(event.id))} className="inline-flex min-h-9 items-center rounded-full bg-viridian px-4 text-xs font-semibold text-white hover:bg-[#568b8b] disabled:opacity-50">{pending ? "Pubblicazione…" : "Pubblica evento"}</button>}
            {!isPublished && <span className="inline-flex min-h-9 items-center rounded-full bg-ink/5 px-3 text-[11px] text-ink/45">L&apos;anteprima sarà disponibile dopo la pubblicazione</span>}
            <button type="button" disabled={pending} onClick={remove} className="ml-auto inline-flex min-h-9 items-center rounded-full border border-candy/25 px-4 text-xs font-semibold text-[#a95d76] hover:bg-candy/10 disabled:opacity-50">Elimina</button>
          </div>
        </div>
      </div>
    </article>
  );
}
