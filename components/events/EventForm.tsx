"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import type { Event } from "@/lib/events/queries";
import {
  createEvent,
  updateEvent,
  type EventInput,
  type EventUpdateInput,
} from "@/app/dashboard/events/actions";

const EVENT_TYPES = [
  ["market", "Mercato"],
  ["workshop", "Workshop"],
  ["exhibition", "Mostra"],
  ["fair", "Fiera"],
  ["pop_up", "Pop-up"],
  ["online", "Evento online"],
  ["external_event", "Evento esterno"],
] as const;

type EventFormProps = { event?: Event };
type FormValues = {
  title: string;
  type: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  shortDescription: string;
  description: string;
  category: string;
  locationName: string;
  city: string;
  address: string;
  externalUrl: string;
};
type Errors = Partial<Record<keyof FormValues | "form", string>>;

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-heather focus:ring-2 focus:ring-heather/10";
const labelClass = "text-xs font-semibold text-ink/75";

function localParts(value: string | null | undefined) {
  if (!value) return { date: "", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  const pad = (part: number) => String(part).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function initialValues(event?: Event): FormValues {
  const start = localParts(event?.start_at);
  const end = localParts(event?.end_at);
  return {
    title: event?.title ?? "",
    type: event?.type ?? "market",
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    shortDescription: event?.short_description ?? "",
    description: event?.description ?? "",
    category: event?.category ?? "",
    locationName: event?.location_name ?? "",
    city: event?.city ?? "",
    address: event?.address ?? "",
    externalUrl: event?.external_url ?? "",
  };
}

function toUtcIso(date: string, time: string) {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-candy" role="alert">{message}</p> : null;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(event));
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = Boolean(event);

  const imagePreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : event?.image_url ?? null),
    [coverFile, event?.image_url],
  );

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const typeLabel = useMemo(
    () => EVENT_TYPES.find(([value]) => value === values.type)?.[1] ?? "Event",
    [values.type],
  );

  function setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
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
    if (end && start && end < start) {
      next.endDate = "La fine non può precedere l'inizio.";
      next.endTime = "La fine non può precedere l'inizio.";
    }
    setErrors(next);
    return { next, start, end };
  }

  function submit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const { next, start, end } = validate();
    if (Object.keys(next).length || !start) return;

    const input: EventInput = {
      title: values.title.trim(),
      slug: event?.slug ?? slugify(values.title),
      type: values.type,
      start_at: start,
      end_at: end,
      short_description: values.shortDescription.trim() || null,
      description: values.description.trim() || null,
      category: values.category.trim() || null,
      location_name: values.locationName.trim() || null,
      city: values.city.trim() || null,
      address: values.address.trim() || null,
      external_url: values.externalUrl.trim() || null,
      image_url: event?.image_url ?? null,
      cover_image: coverFile,
    };

    startTransition(async () => {
      const result = editing
        ? await updateEvent(event!.id, input as EventUpdateInput)
        : await createEvent(input);
      if (!result.success) {
        setErrors({ form: result.error });
        return;
      }
      setNotice(editing ? "Evento salvato." : "Bozza evento creata.");
      router.push(`/dashboard/events/${result.event.id}/edit`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {errors.form && <div role="alert" className="rounded-xl border border-candy/25 bg-candy/10 px-4 py-3 text-sm text-ink">{errors.form}</div>}
      {notice && <div role="status" className="rounded-xl border border-viridian/25 bg-viridian/10 px-4 py-3 text-sm text-ink">{notice}</div>}

      <section className="rounded-[1.5rem] border border-heather/15 bg-white/70 p-5 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">01 · Informazioni</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Racconta cosa succederà</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="title">Titolo *</label><input id="title" value={values.title} onChange={(e) => setValue("title", e.target.value)} className={inputClass} placeholder="Un nome facile da ricordare" /> <FieldError message={errors.title} /></div>
          <div><label className={labelClass} htmlFor="type">Tipo di evento *</label><select id="type" value={values.type} onChange={(e) => setValue("type", e.target.value)} className={inputClass}>{EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><FieldError message={errors.type} /></div>
          <div><label className={labelClass} htmlFor="shortDescription">Descrizione breve</label><input id="shortDescription" value={values.shortDescription} onChange={(e) => setValue("shortDescription", e.target.value)} className={inputClass} placeholder="Un invito in una riga" /><FieldError message={errors.shortDescription} /></div>
          <div><label className={labelClass} htmlFor="category">Categoria</label><input id="category" value={values.category} onChange={(e) => setValue("category", e.target.value)} className={inputClass} placeholder="Artigianato, food, design…" /><FieldError message={errors.category} /></div>
          <div className="sm:col-span-2"><label className={labelClass} htmlFor="description">Descrizione completa</label><textarea id="description" rows={5} value={values.description} onChange={(e) => setValue("description", e.target.value)} className={`${inputClass} py-3`} placeholder="Racconta la storia, il programma e tutti i dettagli." /><FieldError message={errors.description} /></div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-heather/15 bg-white/70 p-5 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">02 · Quando</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Scegli data e orario</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><label className={labelClass} htmlFor="startDate">Data di inizio *</label><input id="startDate" type="date" value={values.startDate} onChange={(e) => setValue("startDate", e.target.value)} className={inputClass} /><FieldError message={errors.startDate} /></div>
          <div><label className={labelClass} htmlFor="startTime">Orario di inizio *</label><input id="startTime" type="time" value={values.startTime} onChange={(e) => setValue("startTime", e.target.value)} className={inputClass} /><FieldError message={errors.startTime} /></div>
          <div><label className={labelClass} htmlFor="endDate">Data di fine</label><input id="endDate" type="date" value={values.endDate} onChange={(e) => setValue("endDate", e.target.value)} className={inputClass} /><FieldError message={errors.endDate} /></div>
          <div><label className={labelClass} htmlFor="endTime">Orario di fine</label><input id="endTime" type="time" value={values.endTime} onChange={(e) => setValue("endTime", e.target.value)} className={inputClass} /><FieldError message={errors.endTime} /></div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-heather/15 bg-white/70 p-5 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">03 · Luogo e link</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Aiuta le persone a trovarlo</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><label className={labelClass} htmlFor="locationName">Nome del luogo</label><input id="locationName" value={values.locationName} onChange={(e) => setValue("locationName", e.target.value)} className={inputClass} placeholder="Studio, spazio eventi…" /><FieldError message={errors.locationName} /></div>
          <div><label className={labelClass} htmlFor="city">Città</label><input id="city" value={values.city} onChange={(e) => setValue("city", e.target.value)} className={inputClass} placeholder="Firenze" /><FieldError message={errors.city} /></div>
          <div><label className={labelClass} htmlFor="address">Indirizzo</label><input id="address" value={values.address} onChange={(e) => setValue("address", e.target.value)} className={inputClass} placeholder="Via e numero civico" /><FieldError message={errors.address} /></div>
          <div><label className={labelClass} htmlFor="externalUrl">Link esterno <span className="font-normal text-ink/45">(facoltativo)</span></label><input id="externalUrl" type="url" value={values.externalUrl} onChange={(e) => setValue("externalUrl", e.target.value)} className={inputClass} placeholder="https://…" /><FieldError message={errors.externalUrl} /></div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-heather/15 bg-white/70 p-5 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heather">04 · Immagine di copertina</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink">Dai un volto al tuo evento</h2>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-sandstone/40 text-2xl text-heather">
            {imagePreview ? (
              <span className="relative size-full">
                <Image
                  src={imagePreview}
                  alt="Copertina corrente dell'evento"
                  fill
                  sizes="96px"
                  unoptimized={imagePreview.startsWith("blob:")}
                  className="object-cover"
                />
              </span>
            ) : "✦"}
          </div>
          <div><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-heather/15 bg-cream/60 px-3 py-3 text-xs text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-heather file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" /><p className="mt-2 text-xs leading-5 text-ink/50">JPEG, PNG o WebP · massimo 5 MB. Le immagini vengono elaborate in sicurezza prima del caricamento.</p>{imagePreview && <p className="mt-1 text-xs text-viridian">{coverFile ? "Nuova copertina selezionata." : "La copertina corrente verrà mantenuta."}</p>}</div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard/events" className="inline-flex min-h-12 items-center justify-center rounded-full border border-heather/20 px-6 text-sm font-semibold text-ink/65 hover:bg-heather/10">Annulla</Link>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-8 text-sm font-semibold text-white transition-colors hover:bg-[#756486] disabled:cursor-wait disabled:opacity-60">{pending ? "Salvataggio…" : editing ? "Salva modifiche" : `Crea bozza · ${typeLabel}`}</button>
      </div>
    </form>
  );
}
