"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import type { Event, EventAgendaItem, EventFaqItem } from "@/lib/events/queries";
import { createEvent, updateEvent, type EventInput, type EventUpdateInput } from "@/app/dashboard/events/actions";

const EVENT_TYPES = [
  ["market", "Mercato"], ["workshop", "Workshop"], ["exhibition", "Mostra"],
  ["fair", "Fiera"], ["pop_up", "Pop-up"], ["online", "Evento online"],
  ["external_event", "Evento esterno"],
] as const;

type EventFormProps = { event?: Event };
type FormValues = {
  title: string; type: string; attendanceMode: "in_person" | "online";
  startDate: string; startTime: string; endDate: string; endTime: string;
  shortDescription: string; description: string; category: string;
  locationName: string; city: string; address: string; onlineAccessInfo: string;
  externalUrl: string; price: string; included: string; features: string;
  agenda: EventAgendaItem[]; faq: EventFaqItem[]; isSoldOut: boolean; isCancelled: boolean;
};
type Errors = Partial<Record<keyof FormValues | "form", string>>;

const inputClass = "mt-2 min-h-12 min-w-0 w-full rounded-xl border border-heather/20 bg-white px-3 text-base text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-heather focus:ring-2 focus:ring-heather/10 sm:px-4 sm:text-sm";
const labelClass = "text-xs font-semibold text-ink/75";

function localParts(value: string | null | undefined) {
  if (!value) return { date: "", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  const pad = (part: number) => String(part).padStart(2, "0");
  return { date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`, time: `${pad(date.getHours())}:${pad(date.getMinutes())}` };
}

function initialValues(event?: Event): FormValues {
  const start = localParts(event?.start_at);
  const end = localParts(event?.end_at);
  return {
    title: event?.title ?? "", type: event?.type ?? "market", attendanceMode: event?.attendance_mode ?? "in_person",
    startDate: start.date, startTime: start.time, endDate: end.date, endTime: end.time,
    shortDescription: event?.short_description ?? "", description: event?.description ?? "", category: event?.category ?? "",
    locationName: event?.location_name ?? "", city: event?.city ?? "", address: event?.address ?? "",
    onlineAccessInfo: event?.online_access_info ?? "", externalUrl: event?.external_url ?? "",
    price: event?.price_cents == null ? "" : (event.price_cents / 100).toFixed(2), included: event?.included ?? "",
    features: (event?.features ?? []).join("\n"),
    agenda: (event?.agenda ?? []).map((item) => ({ ...item })),
    faq: (event?.faq ?? []).map((item) => ({ ...item })),
    isSoldOut: event?.is_sold_out ?? false, isCancelled: event?.is_cancelled ?? false,
  };
}

function toUtcIso(date: string, time: string) {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-candy" role="alert">{message}</p> : null;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs leading-5 text-ink/45">{children}</p>;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(event));
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = Boolean(event);
  const imagePreview = useMemo(() => coverFile ? URL.createObjectURL(coverFile) : event?.image_url ?? null, [coverFile, event?.image_url]);

  useEffect(() => () => { if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview); }, [imagePreview]);
  const typeLabel = useMemo(() => EVENT_TYPES.find(([value]) => value === values.type)?.[1] ?? "Evento", [values.type]);

  function setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  }

  function setAgendaItem(index: number, field: keyof EventAgendaItem, value: string) {
    setValues((current) => ({
      ...current,
      agenda: current.agenda.map((item, itemIndex) => itemIndex === index
        ? { ...item, [field]: field === "description" ? value || null : value }
        : item),
    }));
    setErrors((current) => ({ ...current, agenda: undefined, form: undefined }));
  }

  function setFaqItem(index: number, field: keyof EventFaqItem, value: string) {
    setValues((current) => ({
      ...current,
      faq: current.faq.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
    setErrors((current) => ({ ...current, faq: undefined, form: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (values.title.trim().length < 2) next.title = "Inserisci un titolo di almeno 2 caratteri.";
    if (!values.type) next.type = "Scegli il tipo di evento.";
    if (!values.startDate) next.startDate = "Scegli la data di inizio.";
    if (!values.startTime) next.startTime = "Scegli l'orario di inizio.";
    if ((values.endDate && !values.endTime) || (!values.endDate && values.endTime)) {
      next.endDate = "Inserisci sia la data sia l'orario di fine, oppure lasciali vuoti.";
      next.endTime = next.endDate;
    }
    const start = toUtcIso(values.startDate, values.startTime);
    const end = values.endDate && values.endTime ? toUtcIso(values.endDate, values.endTime) : null;
    if (values.startDate && values.startTime && !start) next.startDate = "Inserisci una data e un orario validi.";
    if (end && start && end < start) { next.endDate = "La fine non può precedere l'inizio."; next.endTime = next.endDate; }
    const normalizedPrice = values.price.trim().replace(",", ".");
    const price = normalizedPrice === "" ? null : Number(normalizedPrice);
    if (price !== null && (!Number.isFinite(price) || price < 0 || Math.round(price * 100) > 100_000_000)) next.price = "Inserisci un prezzo valido e non negativo.";
    const agenda = values.agenda.map((item) => ({
      time: item.time.trim(),
      title: item.title.trim(),
      description: item.description?.trim() || null,
    }));
    if (agenda.some((item) => !item.title)) next.agenda = "Inserisci un titolo per ogni voce del programma.";
    const faq = values.faq.map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }));
    if (faq.some((item) => !item.question || !item.answer)) next.faq = "Completa domanda e risposta per ogni voce.";
    setErrors(next);
    return { next, start, end, price, agenda, faq };
  }

  function submit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const { next, start, end, price, agenda, faq } = validate();
    if (Object.keys(next).length || !start) return;
    const input: EventInput = {
      title: values.title.trim(), slug: event?.slug ?? slugify(values.title), type: values.type,
      attendance_mode: values.attendanceMode, start_at: start, end_at: end,
      short_description: values.shortDescription.trim() || null, description: values.description.trim() || null,
      category: values.category.trim() || null,
      location_name: values.attendanceMode === "in_person" ? values.locationName.trim() || null : null,
      city: values.attendanceMode === "in_person" ? values.city.trim() || null : null,
      address: values.attendanceMode === "in_person" ? values.address.trim() || null : null,
      online_access_info: values.attendanceMode === "online" ? values.onlineAccessInfo.trim() || null : null,
      external_url: values.externalUrl.trim() || null, image_url: event?.image_url ?? null,
      price_cents: price === null ? null : Math.round(price * 100), included: values.included.trim() || null,
      features: values.features.split(/[\n,]/).map((item) => item.trim()).filter(Boolean), agenda, faq,
      is_sold_out: values.isSoldOut, is_cancelled: values.isCancelled, cover_image: coverFile,
    };
    startTransition(async () => {
      const result = editing ? await updateEvent(event!.id, input as EventUpdateInput) : await createEvent(input);
      if (!result.success) { setErrors({ form: result.error }); return; }
      setNotice(editing ? "Evento salvato." : "Bozza evento creata.");
      router.push(`/dashboard/events/${result.event.id}/edit`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid min-w-0 gap-4 sm:gap-5" noValidate>
      {errors.form && <div role="alert" className="rounded-xl border border-candy/25 bg-candy/10 px-4 py-3 text-sm text-ink">{errors.form}</div>}
      {notice && <div role="status" className="rounded-xl border border-viridian/25 bg-viridian/10 px-4 py-3 text-sm text-ink">{notice}</div>}

      <section className="min-w-0 rounded-[1.25rem] border border-heather/15 bg-white/70 p-4 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">01 · Informazioni</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Racconta cosa succederà</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="title">Titolo *</label><input id="title" value={values.title} onChange={(e) => setValue("title", e.target.value)} className={inputClass} placeholder="Un nome facile da ricordare" /><FieldError message={errors.title} /></div>
          <div><label className={labelClass} htmlFor="type">Tipo di evento *</label><select id="type" value={values.type} onChange={(e) => setValue("type", e.target.value)} className={inputClass}>{EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><FieldError message={errors.type} /></div>
          <div><label className={labelClass} htmlFor="shortDescription">Descrizione breve</label><input id="shortDescription" value={values.shortDescription} onChange={(e) => setValue("shortDescription", e.target.value)} className={inputClass} placeholder="Un invito in una riga" /></div>
          <div><label className={labelClass} htmlFor="category">Categoria</label><input id="category" value={values.category} onChange={(e) => setValue("category", e.target.value)} className={inputClass} placeholder="Artigianato, food, design…" /></div>
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="description">Descrizione completa</label><textarea id="description" rows={5} value={values.description} onChange={(e) => setValue("description", e.target.value)} className={`${inputClass} py-3`} placeholder="Racconta la storia e tutti i dettagli." /></div>
        </div>
      </section>

      <section className="min-w-0 rounded-[1.25rem] border border-heather/15 bg-white/70 p-4 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">02 · Quando</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Scegli data e orario</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><label className={labelClass} htmlFor="startDate">Data di inizio *</label><input id="startDate" type="date" value={values.startDate} onChange={(e) => setValue("startDate", e.target.value)} className={inputClass} /><FieldError message={errors.startDate} /></div>
          <div><label className={labelClass} htmlFor="startTime">Orario di inizio *</label><input id="startTime" type="time" value={values.startTime} onChange={(e) => setValue("startTime", e.target.value)} className={inputClass} /><FieldError message={errors.startTime} /></div>
          <div><label className={labelClass} htmlFor="endDate">Data di fine</label><input id="endDate" type="date" value={values.endDate} onChange={(e) => setValue("endDate", e.target.value)} className={inputClass} /><FieldError message={errors.endDate} /></div>
          <div><label className={labelClass} htmlFor="endTime">Orario di fine</label><input id="endTime" type="time" value={values.endTime} onChange={(e) => setValue("endTime", e.target.value)} className={inputClass} /><FieldError message={errors.endTime} /></div>
        </div>
      </section>

      <section className="min-w-0 rounded-[1.25rem] border border-heather/15 bg-white/70 p-4 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">03 · Luogo e accesso</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Spiega come partecipare</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="attendanceMode">Modalità *</label><select id="attendanceMode" value={values.attendanceMode} onChange={(e) => setValue("attendanceMode", e.target.value as FormValues["attendanceMode"])} className={inputClass}><option value="in_person">In presenza</option><option value="online">Online</option></select></div>
          {values.attendanceMode === "in_person" ? <>
            <div><label className={labelClass} htmlFor="locationName">Nome del luogo</label><input id="locationName" value={values.locationName} onChange={(e) => setValue("locationName", e.target.value)} className={inputClass} placeholder="Studio, spazio eventi…" /></div>
            <div><label className={labelClass} htmlFor="city">Città</label><input id="city" value={values.city} onChange={(e) => setValue("city", e.target.value)} className={inputClass} placeholder="Firenze" /></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="address">Indirizzo</label><input id="address" value={values.address} onChange={(e) => setValue("address", e.target.value)} className={inputClass} placeholder="Via e numero civico" /></div>
          </> : <div className="sm:col-span-2"><label className={labelClass} htmlFor="onlineAccessInfo">Informazioni per l’accesso online</label><textarea id="onlineAccessInfo" rows={3} value={values.onlineAccessInfo} onChange={(e) => setValue("onlineAccessInfo", e.target.value)} className={`${inputClass} py-3`} placeholder="Quando e come riceveranno il link di accesso" /><Hint>Non inserire qui credenziali o link riservati.</Hint></div>}
        </div>
      </section>

      <section className="min-w-0 rounded-[1.25rem] border border-heather/15 bg-white/70 p-4 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">04 · Partecipazione</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Configura prezzo e iscrizione</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><label className={labelClass} htmlFor="price">Prezzo in euro</label><input id="price" inputMode="decimal" value={values.price} onChange={(e) => setValue("price", e.target.value)} className={inputClass} placeholder="0 per gratuito, vuoto se non definito" /><FieldError message={errors.price} /></div>
          <div><label className={labelClass} htmlFor="externalUrl">Link di iscrizione o acquisto</label><input id="externalUrl" type="url" value={values.externalUrl} onChange={(e) => setValue("externalUrl", e.target.value)} className={inputClass} placeholder="https://…" /><Hint>Se manca, la pagina avvisa che le iscrizioni non sono ancora disponibili.</Hint></div>
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="included">Cosa è incluso</label><input id="included" value={values.included} onChange={(e) => setValue("included", e.target.value)} className={inputClass} placeholder="Materiali, consumazione, attestato…" /></div>
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="features">Caratteristiche</label><textarea id="features" rows={3} value={values.features} onChange={(e) => setValue("features", e.target.value)} className={`${inputClass} py-3`} placeholder={'Networking\nDrink incluso\nAdatto ai principianti'} /><Hint>Una caratteristica per riga, massimo 8.</Hint></div>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-heather/15 bg-cream/45 px-4 text-sm text-ink"><input type="checkbox" checked={values.isSoldOut} onChange={(e) => setValue("isSoldOut", e.target.checked)} className="size-4 accent-[#df5f8c]" /> Posti esauriti</label>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-heather/15 bg-cream/45 px-4 text-sm text-ink"><input type="checkbox" checked={values.isCancelled} onChange={(e) => setValue("isCancelled", e.target.checked)} className="size-4 accent-[#df5f8c]" /> Evento annullato</label>
        </div>
      </section>

      <section className="min-w-0 rounded-[1.25rem] border border-heather/15 bg-white/70 p-4 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">05 · Programma e FAQ</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Aggiungi i dettagli utili</h2>
        <div className="mt-6 grid gap-8">
          <fieldset>
            <legend className={labelClass}>Programma</legend>
            <p className="mt-1 text-xs leading-5 text-ink/45">Aggiungi soltanto le tappe che vuoi mostrare nella pagina dell’evento.</p>
            <div className="mt-3 grid gap-3">
              {values.agenda.map((item, index) => (
                <div key={index} className="min-w-0 rounded-2xl border border-heather/15 bg-cream/35 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-heather">Tappa {index + 1}</p>
                    <button type="button" onClick={() => setValue("agenda", values.agenda.filter((_, itemIndex) => itemIndex !== index))} className="min-h-9 shrink-0 rounded-full px-3 text-xs font-semibold text-candy hover:bg-candy/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy">Rimuovi</button>
                  </div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <div><label className={labelClass} htmlFor={`agenda-time-${index}`}>Orario</label><input id={`agenda-time-${index}`} type="time" value={item.time} onChange={(e) => setAgendaItem(index, "time", e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass} htmlFor={`agenda-title-${index}`}>Titolo *</label><input id={`agenda-title-${index}`} value={item.title} onChange={(e) => setAgendaItem(index, "title", e.target.value)} className={inputClass} placeholder="Es. Benvenuto e check-in" /></div>
                    <div className="sm:col-span-2"><label className={labelClass} htmlFor={`agenda-description-${index}`}>Descrizione</label><textarea id={`agenda-description-${index}`} rows={2} value={item.description ?? ""} onChange={(e) => setAgendaItem(index, "description", e.target.value)} className={`${inputClass} py-3`} placeholder="Aggiungi qualche dettaglio, se serve" /></div>
                  </div>
                </div>
              ))}
              {values.agenda.length === 0 && <p className="rounded-xl border border-dashed border-heather/20 px-4 py-5 text-center text-xs text-ink/45">Nessuna tappa aggiunta.</p>}
              <button type="button" onClick={() => setValue("agenda", [...values.agenda, { time: "", title: "", description: null }])} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-heather/25 px-5 text-sm font-semibold text-heather transition hover:bg-heather/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather sm:min-h-11 sm:w-fit sm:text-xs">+ Aggiungi una tappa</button>
              <FieldError message={errors.agenda} />
            </div>
          </fieldset>

          <fieldset className="border-t border-heather/10 pt-7">
            <legend className={labelClass}>Domande frequenti</legend>
            <p className="mt-1 text-xs leading-5 text-ink/45">Ogni domanda verrà mostrata come sezione apribile nella pagina pubblica.</p>
            <div className="mt-3 grid gap-3">
              {values.faq.map((item, index) => (
                <div key={index} className="min-w-0 rounded-2xl border border-heather/15 bg-cream/35 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-heather">Domanda {index + 1}</p>
                    <button type="button" onClick={() => setValue("faq", values.faq.filter((_, itemIndex) => itemIndex !== index))} className="min-h-9 shrink-0 rounded-full px-3 text-xs font-semibold text-candy hover:bg-candy/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-candy">Rimuovi</button>
                  </div>
                  <div className="mt-2 grid gap-3">
                    <div><label className={labelClass} htmlFor={`faq-question-${index}`}>Domanda *</label><input id={`faq-question-${index}`} value={item.question} onChange={(e) => setFaqItem(index, "question", e.target.value)} className={inputClass} placeholder="Es. Serve prenotare?" /></div>
                    <div><label className={labelClass} htmlFor={`faq-answer-${index}`}>Risposta *</label><textarea id={`faq-answer-${index}`} rows={3} value={item.answer} onChange={(e) => setFaqItem(index, "answer", e.target.value)} className={`${inputClass} py-3`} placeholder="Scrivi una risposta chiara e breve" /></div>
                  </div>
                </div>
              ))}
              {values.faq.length === 0 && <p className="rounded-xl border border-dashed border-heather/20 px-4 py-5 text-center text-xs text-ink/45">Nessuna domanda aggiunta.</p>}
              <button type="button" onClick={() => setValue("faq", [...values.faq, { question: "", answer: "" }])} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-heather/25 px-5 text-sm font-semibold text-heather transition hover:bg-heather/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather sm:min-h-11 sm:w-fit sm:text-xs">+ Aggiungi una domanda</button>
              <FieldError message={errors.faq} />
            </div>
          </fieldset>
        </div>
      </section>

      <section className="min-w-0 rounded-[1.25rem] border border-heather/15 bg-white/70 p-4 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">06 · Immagine di copertina</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Dai un volto al tuo evento</h2>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-sandstone/40 text-2xl text-heather">{imagePreview ? <span className="relative size-full"><Image src={imagePreview} alt="Copertina corrente dell'evento" fill sizes="96px" unoptimized={imagePreview.startsWith("blob:")} className="object-cover" /></span> : "✦"}</div>
          <div className="min-w-0"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="max-w-full rounded-xl border border-heather/15 bg-cream/60 px-2 py-3 text-xs text-ink/70 file:mr-2 file:rounded-full file:border-0 file:bg-heather file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white sm:w-full sm:px-3" /><p className="mt-2 text-xs leading-5 text-ink/50">JPEG, PNG o WebP · massimo 5 MB.</p>{imagePreview && <p className="mt-1 break-words text-xs text-viridian">{coverFile ? "Nuova copertina selezionata." : "La copertina corrente verrà mantenuta."}</p>}</div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard/events" className="inline-flex min-h-12 items-center justify-center rounded-full border border-heather/20 px-6 text-sm font-semibold text-ink/65 hover:bg-heather/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather">Annulla</Link>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-8 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heather disabled:cursor-wait disabled:opacity-60">{pending ? "Salvataggio…" : editing ? "Salva modifiche" : `Crea bozza · ${typeLabel}`}</button>
      </div>
    </form>
  );
}
