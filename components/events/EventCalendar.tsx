"use client";

import { useMemo, useState } from "react";
import type { HomepageEvent } from "@/lib/data/homepage";

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(date);
}

export function EventCalendar({ events }: { events: HomepageEvent[] }) {
  const initialDate = events[0] ? new Date(events[0].date) : new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(events[0] ? new Date(events[0].date) : null);

  const eventsByDay = useMemo(() => {
    const groups = new Map<string, HomepageEvent[]>();
    events.forEach((event) => {
      const key = dateKey(new Date(event.date));
      groups.set(key, [...(groups.get(key) ?? []), event]);
    });
    return groups;
  }, [events]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
  const selectedEvents = selectedDate ? eventsByDay.get(dateKey(selectedDate)) ?? [] : [];
  const selectedLabel = selectedDate ? new Intl.DateTimeFormat("it-IT", { weekday: "long", month: "long", day: "numeric" }).format(selectedDate) : "Seleziona una data";

  function moveMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDate(null);
  }

  return <>
    <article className="h-full min-h-60 rounded-xl border border-heather/15 bg-white/70 p-4 lg:min-h-0 xl:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold tracking-[-0.03em] text-ink xl:text-lg">Calendario eventi</h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Mese precedente" className="grid size-7 place-items-center rounded-full text-heather hover:bg-heather/10 xl:size-9">‹</button>
          <span className="min-w-28 text-center text-xs font-semibold text-heather xl:text-sm">{formatMonth(visibleMonth)}</span>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Mese successivo" className="grid size-7 place-items-center rounded-full text-heather hover:bg-heather/10 xl:size-9">›</button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-ink/45 xl:mt-5 xl:text-[10px]">{["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: leadingDays }, (_, index) => <span key={`empty-${index}`} className="h-7 sm:h-8 xl:h-10" />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = new Date(year, month, day);
          const dayEvents = eventsByDay.get(dateKey(date)) ?? [];
          const isSelected = selectedDate ? dateKey(selectedDate) === dateKey(date) : false;
          return <button key={day} type="button" onClick={() => setSelectedDate(date)} aria-pressed={isSelected} aria-label={`${day} ${formatMonth(visibleMonth)}${dayEvents.length ? `, ${dayEvents.length} eventi` : ""}`} className={`relative grid h-7 place-items-center rounded-full text-xs transition-colors sm:h-8 xl:h-10 xl:text-sm ${isSelected ? "bg-heather font-semibold text-white shadow-sm" : dayEvents.length ? "bg-heather/15 font-semibold text-heather hover:bg-heather/25" : "text-ink/65 hover:bg-heather/10"}`}>{day}{dayEvents.length > 0 && !isSelected && <span className="absolute bottom-1 size-1 rounded-full bg-candy" />}</button>;
        })}
      </div>
    </article>

    <article className="h-full min-h-60 rounded-xl border border-heather/15 bg-white/70 p-4 lg:min-h-0 xl:p-5">
      <div className="flex items-center justify-between gap-3"><h2 className="font-semibold tracking-[-0.03em] text-ink xl:text-lg">Eventi del {selectedLabel}</h2><span className="rounded-full bg-candy/15 px-2 py-1 text-[9px] font-bold text-[#a95d76] xl:text-[10px]">{selectedEvents.length} eventi</span></div>
      {selectedEvents.length === 0 ? <p className="mt-8 text-center text-sm text-ink/55">Nessun evento pubblicato in questa data.</p> : <div className="mt-4 grid gap-3">{selectedEvents.map((event) => <div key={event.id} className="flex items-center gap-3"><div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sandstone/30"><span className="absolute inset-0 grid place-items-center text-base text-heather">✦</span></div><div className="min-w-0"><p className="truncate text-xs font-semibold text-ink">{event.title}</p><p className="mt-1 truncate text-[10px] text-ink/55">{formatTime(event.date)}{event.location ? ` · ${event.location}` : ""}</p></div>{event.href ? <a href={event.href} target="_blank" rel="noreferrer" className="ml-auto text-heather">›</a> : <span className="ml-auto text-ink/35">›</span>}</div>)}</div>}
      <button type="button" onClick={() => { setVisibleMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)); setSelectedDate(events[0] ? new Date(events[0].date) : null); }} className="mt-4 flex min-h-8 w-full items-center justify-center rounded-full border border-heather/15 text-[10px] font-semibold text-heather">Vai al prossimo evento</button>
    </article>
  </>;
}
