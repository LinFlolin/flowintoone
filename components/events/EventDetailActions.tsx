"use client";

import { useState } from "react";

type CalendarEvent = {
  title: string;
  slug: string;
  startAt: string;
  endAt: string | null;
  description: string | null;
  location: string | null;
};

type ParticipationActionsProps = CalendarEvent & {
  registrationUrl: string | null;
  ctaLabel: string;
  disabledReason: string | null;
};

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function icsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function CalendarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /></svg>;
}

export function ParticipationActions(props: ParticipationActionsProps) {
  function downloadCalendar() {
    const description = props.description ? escapeIcs(props.description) : "";
    const location = props.location ? escapeIcs(props.location) : "";
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Flowintoone//Events//IT", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT", `UID:${props.slug}@flowintoone`, `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(props.startAt)}`, `DTEND:${icsDate(props.endAt ?? props.startAt)}`,
      `SUMMARY:${escapeIcs(props.title)}`, `DESCRIPTION:${description}`, `LOCATION:${location}`,
      "END:VEVENT", "END:VCALENDAR",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const unavailable = Boolean(props.disabledReason || !props.registrationUrl);

  return <div className="mt-6 grid gap-2.5">
    {unavailable ? (
      <button type="button" disabled className="inline-flex min-h-12 items-center justify-center rounded-xl bg-candy/45 px-5 text-sm font-bold text-white disabled:cursor-not-allowed" aria-describedby="registration-status">{props.ctaLabel}</button>
    ) : (
      <a href={props.registrationUrl!} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-candy px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(222,95,140,0.22)] transition hover:bg-[#cf4f7d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy">{props.ctaLabel}<span aria-hidden="true">→</span></a>
    )}
    {unavailable && <p id="registration-status" role="status" className="px-1 text-center text-xs leading-5 text-ink/55">{props.disabledReason ?? "Le iscrizioni non sono ancora disponibili."}</p>}
    <button type="button" onClick={downloadCalendar} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-heather/20 bg-white px-5 text-sm font-semibold text-ink transition hover:bg-heather/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather"><CalendarIcon />Aggiungi al calendario</button>
  </div>;
}

export function ShareEventButton({ title }: { title: string }) {
  const [notice, setNotice] = useState<string | null>(null);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Link copiato");
      window.setTimeout(() => setNotice(null), 2200);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Copia il link dalla barra del browser");
    }
  }

  return <div className="relative">
    <button type="button" onClick={share} aria-label={`Condividi ${title}`} className="grid size-10 place-items-center rounded-full text-heather transition hover:bg-heather/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></svg>
    </button>
    {notice && <span role="status" className="absolute right-0 top-11 z-10 w-max max-w-56 rounded-lg bg-ink px-3 py-2 text-xs text-white shadow-lg">{notice}</span>}
  </div>;
}
