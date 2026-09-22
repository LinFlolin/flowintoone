"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  readCreateFlowState,
  writeCreateFlowState,
  type WebsiteDetails,
  type WebsitePurpose,
} from "@/lib/create-flow";
import { normalizeStorefrontSlug } from "@/lib/storefront/slug";

type Category = { id: string; name: string };

const purposeLabels: Record<WebsitePurpose, string> = {
  shop: "Negozio",
  events: "Eventi",
  portfolio: "Portfolio",
  services: "Servizi",
  personal: "Personale",
};
const inputClassName = "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-heather focus:outline-2";

function Progress() {
  return (
    <ol className="mt-9 grid grid-cols-4 gap-2 sm:mt-11 sm:gap-6" aria-label="Avanzamento creazione sito">
      {["Scopo", "Dettagli", "Design", "Riepilogo"].map((label, index) => {
        const active = index === 1;
        return (
          <li key={label} className="relative text-center">
            {index > 0 && <span className="absolute right-1/2 top-4 -z-10 hidden h-px w-full bg-heather/20 sm:block" />}
            <span className={`relative mx-auto grid size-8 place-items-center rounded-full border text-xs font-semibold ${active ? "border-heather bg-heather text-white" : "border-heather/20 bg-cream text-ink/60"}`}>{index + 1}</span>
            <span className={`mt-2 block text-[10px] font-semibold sm:text-xs ${active ? "text-ink" : "text-ink/45"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function WebsiteDetailsStep({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const flow = readCreateFlowState();
  const [purpose] = useState(flow.purpose);
  const [details, setDetails] = useState<WebsiteDetails>(flow.details);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof WebsiteDetails, value: string) {
    setDetails((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" && !current.slug) next.slug = normalizeStorefrontSlug(value);
      return next;
    });
    setError(null);
  }

  function continueToDesign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!purpose) {
      router.replace("/create");
      return;
    }
    if (details.name.trim().length < 2) return setError("Inserisci il nome del sito o dell'attività.");
    if (!details.description.trim()) return setError("Aggiungi una breve descrizione del tuo lavoro.");
    if (!details.categoryId) return setError("Seleziona una categoria.");
    if (!details.city.trim() || !details.country.trim()) return setError("Inserisci città e Paese.");
    if (!details.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(details.slug)) return setError("Usa uno slug valido per l'URL pubblico.");
    if (!writeCreateFlowState({ purpose, details, step: "design" })) {
      return setError("Non è stato possibile salvare i tuoi progressi. Controlla le impostazioni del browser e riprova.");
    }
    router.push("/create/design");
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-4xl rounded-[2rem] border border-heather/10 bg-white/35 px-5 py-8 shadow-[0_20px_70px_rgba(81,68,91,0.06)] sm:min-h-[calc(100vh-4rem)] sm:px-12 sm:py-12">
        <div className="flex items-center justify-between gap-4"><Link href="/create" className="text-xs font-semibold text-ink/55 hover:text-heather">← Indietro</Link><Link href="/dashboard" className="text-xs font-semibold text-ink/55 hover:text-heather">Salva ed esci</Link></div>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-heather">Passaggio 2 di 4</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Parlaci del tuo sito</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">Questi sono gli stessi dettagli usati dal tuo editor. Potrai perfezionarli in seguito.</p>
        <Progress />
        <form onSubmit={continueToDesign} className="mt-10 grid gap-7">
          <section className="grid gap-6 rounded-2xl border border-heather/15 bg-white/55 p-5 sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-heather">{purpose ? purposeLabels[purpose] : "Sito"}</p>
              <h2 className="mt-2 text-2xl font-semibold">Le informazioni essenziali</h2>
            </div>
            <label className="text-sm font-semibold">Nome del sito o dell&apos;attività <span className="text-candy">*</span><input className={inputClassName} name="name" value={details.name} onChange={(event) => update("name", event.target.value)} maxLength={100} required /></label>
            <label className="text-sm font-semibold">Sottotitolo <span className="font-normal text-ink/45">(facoltativo)</span><input className={inputClassName} name="tagline" value={details.tagline} onChange={(event) => update("tagline", event.target.value)} maxLength={160} /></label>
            <label className="text-sm font-semibold">Descrizione <span className="text-candy">*</span><textarea className={`${inputClassName} min-h-36 resize-y py-3 leading-6`} name="description" value={details.description} onChange={(event) => update("description", event.target.value)} maxLength={4000} required /></label>
            <div className="grid gap-6 sm:grid-cols-3">
              <label className="text-sm font-semibold">Categoria <span className="text-candy">*</span><select className={inputClassName} name="categoryId" value={details.categoryId} onChange={(event) => update("categoryId", event.target.value)} required><option value="">Seleziona una categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label className="text-sm font-semibold">Città <span className="text-candy">*</span><input className={inputClassName} name="city" value={details.city} onChange={(event) => update("city", event.target.value)} maxLength={120} required /></label>
              <label className="text-sm font-semibold">Paese <span className="text-candy">*</span><input className={inputClassName} name="country" value={details.country} onChange={(event) => update("country", event.target.value)} maxLength={120} required /></label>
            </div>
          </section>
          <section className="grid gap-6 rounded-2xl border border-heather/15 bg-white/55 p-5 sm:p-7">
            <div><h2 className="text-2xl font-semibold">La tua storia e i tuoi link</h2><p className="mt-2 text-sm leading-6 text-ink/55">Puoi completare i dettagli facoltativi più avanti nell&apos;editor.</p></div>
            <div className="grid gap-6 lg:grid-cols-2"><label className="text-sm font-semibold">Materiali<textarea className={`${inputClassName} min-h-28 resize-y py-3`} name="materials" value={details.materials} onChange={(event) => update("materials", event.target.value)} maxLength={2000} /></label><label className="text-sm font-semibold">Processo creativo<textarea className={`${inputClassName} min-h-28 resize-y py-3`} name="creativeProcess" value={details.creativeProcess} onChange={(event) => update("creativeProcess", event.target.value)} maxLength={3000} /></label></div>
            <div className="grid gap-6 sm:grid-cols-2"><label className="text-sm font-semibold">URL del sito<input className={inputClassName} name="websiteUrl" value={details.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} inputMode="url" /></label><label className="text-sm font-semibold">URL Instagram<input className={inputClassName} name="instagramUrl" value={details.instagramUrl} onChange={(event) => update("instagramUrl", event.target.value)} inputMode="url" /></label><label className="text-sm font-semibold">URL negozio Etsy<input className={inputClassName} name="etsyUrl" value={details.etsyUrl} onChange={(event) => update("etsyUrl", event.target.value)} inputMode="url" /></label><label className="text-sm font-semibold">Email di contatto pubblica<input className={inputClassName} type="email" name="contactEmail" value={details.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} /></label></div>
          </section>
          <section className="rounded-2xl border border-heather/15 bg-white/55 p-5 sm:p-7"><label className="text-sm font-semibold">Slug URL pubblico <span className="text-candy">*</span><input className={inputClassName} name="slug" value={details.slug} onChange={(event) => update("slug", normalizeStorefrontSlug(event.target.value))} maxLength={80} required /></label><p className="mt-2 text-xs text-ink/50">Il tuo URL pubblico sarà /artisans/{details.slug || "il-tuo-nome"}.</p></section>
          <div className="flex flex-col gap-4 border-t border-heather/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-sm text-xs leading-5 text-ink/50">I tuoi progressi vengono salvati in questo browser durante la procedura.</p><div className="flex flex-col gap-3 sm:flex-row sm:items-center">{error && <p role="alert" className="text-xs text-candy">{error}</p>}<button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-heather px-6 text-sm font-semibold text-white hover:bg-[#756486]">Prossimo passo →</button></div></div>
        </form>
      </div>
    </main>
  );
}
