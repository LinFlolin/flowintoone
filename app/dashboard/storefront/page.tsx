import Link from "next/link";
import type { ReactNode } from "react";
import { StorefrontGalleryField } from "@/components/dashboard/StorefrontGalleryField";
import { StorefrontImageFields } from "@/components/dashboard/StorefrontImageFields";
import { StorefrontNameField } from "@/components/dashboard/StorefrontNameField";
import { StorefrontSubmitButtons } from "@/components/dashboard/StorefrontSubmitButtons";
import { requireCreator } from "@/lib/auth/roles";
import { saveStorefrontAction } from "./actions";

type StorefrontPageProps = {
  searchParams: Promise<{ error?: string; message?: string; businessId?: string }>;
};

type StorefrontBusiness = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  materials: string | null;
  creative_process: string | null;
  category_id: string;
  category_text: string | null;
  city: string | null;
  country: string | null;
  website_url: string | null;
  instagram_url: string | null;
  etsy_url: string | null;
  contact_email: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery_image_urls: string[] | null;
  gallery_items: Array<{ url: string; region: string | null }> | null;
  organizer_bio: string | null;
  past_events: string | null;
  event_regions: string | null;
  partners: Array<{ name: string; logo_url: string | null; website_url: string | null }> | null;
  website_purpose: string | null;
  status: string;
};

type StorefrontCategory = {
  id: string;
  name: string;
};

type EditorSectionProps = {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-heather focus:outline-2";

function EditorSection({ number, title, description, children }: EditorSectionProps) {
  return (
    <section className="rounded-[2rem] border border-heather/15 bg-white/65 p-6 sm:p-10">
      <div className="border-b border-heather/10 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          {number}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">{description}</p>
      </div>
      <div className="mt-7 grid gap-7">{children}</div>
    </section>
  );
}

export default async function StorefrontPage({ searchParams }: StorefrontPageProps) {
  const { supabase, userId, role } = await requireCreator();
  const params = await searchParams;
  const businessQuery = supabase
    .from("businesses")
    .select(
      "id, name, slug, tagline, description, materials, creative_process, category_id, category_text, city, country, website_url, instagram_url, etsy_url, contact_email, logo_url, cover_image_url, gallery_image_urls, gallery_items, organizer_bio, past_events, event_regions, partners, website_purpose, status",
    )
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);
  if (params.businessId) businessQuery.eq("id", params.businessId);
  const [businessResult, categoriesResult] = await Promise.all([
    businessQuery.maybeSingle(),
    supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);
  const business = businessResult.data as StorefrontBusiness | null;
  const categories = (categoriesResult.data ?? []) as StorefrontCategory[];
  const hasLoadError = Boolean(businessResult.error || categoriesResult.error);
  const galleryImageUrls = Array.isArray(business?.gallery_image_urls)
    ? business.gallery_image_urls
    : [];
  const isOrganizer = role === "organizer" || business?.website_purpose === "events";
  const publishingChecklist = [
    { label: "Nome attività", complete: Boolean(business?.name.trim()) },
    { label: "Categoria", complete: Boolean(business?.category_id || business?.category_text) },
    { label: "La nostra storia", complete: Boolean(business?.description?.trim()) },
    { label: "Città", complete: Boolean(business?.city?.trim()) },
    { label: "Paese", complete: Boolean(business?.country?.trim()) },
  ];

  return (
    <section className="w-full py-4 sm:py-8">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
      >
        ← Torna alla dashboard
      </Link>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          {business ? "Editor del sito" : "Nuovo sito"}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
            Dai forma al tuo sito<span className="text-candy">.</span>
          </h1>
          {business && (
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] ${
                business.status === "published"
                  ? "bg-viridian/15 text-[#477b7b]"
                  : "bg-sandstone/55 text-ink/65"
              }`}
            >
              {business.status}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/60 sm:text-base">
          {isOrganizer
            ? "Presenta chi organizza, le esperienze che hai creato e le persone che le rendono possibili."
            : "Crea uno spazio editoriale per il tuo lavoro, dalle idee e dai materiali alle fotografie che lo rendono vivo."}
        </p>
      </div>

      {(params.error || params.message) && (
        <p
          role={params.error ? "alert" : "status"}
          className={`mt-8 rounded-xl border px-4 py-3 text-sm leading-6 ${
            params.error
              ? "border-candy/25 bg-candy/10 text-ink"
              : "border-viridian/25 bg-viridian/10 text-ink"
          }`}
        >
          {params.error || params.message}
        </p>
      )}

      {hasLoadError ? (
        <div className="mt-8 rounded-[2rem] border border-candy/25 bg-candy/10 p-7 text-sm leading-6 text-ink">
          Non è stato possibile caricare l&apos;editor del sito. Verifica che la migrazione
          Storefront 2.0 sia stata applicata, poi riprova.
        </div>
      ) : (
        <form action={saveStorefrontAction} className="mt-10 grid gap-6">
          {business && <input type="hidden" name="businessId" value={business.id} />}

          <EditorSection
            number="01 — Informazioni attività"
            title="Le informazioni essenziali"
            description="Imposta identità, categoria e posizione che aiutano i visitatori a capire subito la tua attività."
          >
            <StorefrontNameField
              initialName={business?.name ?? ""}
              initialSlug={business?.slug ?? null}
              publicPath={isOrganizer ? "organizers" : "artisans"}
            />

            <label className="text-sm font-semibold text-ink">
              Sottotitolo <span className="font-normal text-ink/45">(facoltativo)</span>
              <input
                className={inputClassName}
                name="tagline"
                defaultValue={business?.tagline ?? ""}
                maxLength={160}
                placeholder="Ceramiche artigianali ispirate alla costa mediterranea."
              />
              <span className="mt-2 block text-xs font-normal text-ink/45">
                Una breve introduzione mostrata in evidenza sul tuo sito pubblico.
              </span>
            </label>

            <div className="grid gap-6 sm:grid-cols-3">
              <label className="text-sm font-semibold text-ink sm:col-span-1">
                Categoria <span className="text-candy">*</span>
                <select
                  className={inputClassName}
                  name="categoryId"
                  defaultValue={business?.category_id ?? (business?.category_text ? "__custom__" : categories[0]?.id ?? "")}
                  aria-describedby={categories.length === 0 ? "category-unavailable" : undefined}
                  required
                >
                  <option value="" disabled>
                    {categories.length === 0 ? "Nessuna categoria disponibile" : "Seleziona una categoria"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="__custom__">Altro</option>
                </select>
                <input className={inputClassName} name="categoryText" defaultValue={business?.category_text ?? ""} maxLength={120} placeholder="Se scegli Altro, specifica qui la categoria" />
                {categories.length === 0 && (
                  <span id="category-unavailable" className="mt-2 block text-xs font-normal text-candy">
                    Nessuna categoria attiva disponibile. Il salvataggio è disabilitato.
                  </span>
                )}
              </label>
              <label className="text-sm font-semibold text-ink">
                Città
                <input
                  className={inputClassName}
                  name="city"
                  defaultValue={business?.city ?? ""}
                  maxLength={120}
                  autoComplete="address-level2"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Paese
                <input
                  className={inputClassName}
                  name="country"
                  defaultValue={business?.country ?? ""}
                  maxLength={120}
                  autoComplete="country-name"
                />
              </label>
            </div>
          </EditorSection>

          <EditorSection
            number="02 — La nostra storia"
            title={isOrganizer ? "Chi organizza e cosa crea" : "Il significato del tuo lavoro"}
            description={isOrganizer ? "Racconta la tua identità, le edizioni passate e i territori in cui porti i tuoi eventi." : "Condividi la storia, i materiali e il processo che rendono unica la tua pratica."}
          >
            <label className="text-sm font-semibold text-ink">
              La tua storia
              <textarea
                className={`${inputClassName} min-h-48 resize-y py-3 leading-6`}
                name="description"
                defaultValue={business?.description ?? ""}
                maxLength={4000}
                placeholder="Come è iniziata la tua pratica? Quali idee e luoghi continuano a ispirarti?"
              />
              <span className="mt-2 block text-xs font-normal text-ink/45">
                Necessario prima della pubblicazione.
              </span>
            </label>

            {isOrganizer ? <div className="grid gap-6">
              <label className="text-sm font-semibold text-ink">Chi siamo<textarea className={`${inputClassName} min-h-36 resize-y py-3 leading-6`} name="organizerBio" defaultValue={business?.organizer_bio ?? ""} maxLength={4000} placeholder="Chi organizza gli eventi, con quale visione e per chi." /></label>
              <label className="text-sm font-semibold text-ink">Eventi organizzati in passato<textarea className={`${inputClassName} min-h-40 resize-y py-3 leading-6`} name="pastEvents" defaultValue={business?.past_events ?? ""} maxLength={5000} placeholder="Racconta le edizioni, le collaborazioni e i risultati più importanti." /></label>
              <label className="text-sm font-semibold text-ink">Regioni degli eventi<textarea className={`${inputClassName} min-h-24 resize-y py-3 leading-6`} name="eventRegions" defaultValue={business?.event_regions ?? ""} maxLength={1000} placeholder="es. Lombardia, Toscana, Lazio" /></label>
            </div> : <div className="grid gap-6 lg:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                Materiali <span className="font-normal text-ink/45">(facoltativi)</span>
                <textarea
                  className={`${inputClassName} min-h-36 resize-y py-3 leading-6`}
                  name="materials"
                  defaultValue={business?.materials ?? ""}
                  maxLength={2000}
                  placeholder="Descrivi i materiali che scegli, da dove provengono e perché sono importanti."
                />
              </label>

              <label className="text-sm font-semibold text-ink">
                Processo creativo <span className="font-normal text-ink/45">(facoltativo)</span>
                <textarea
                  className={`${inputClassName} min-h-36 resize-y py-3 leading-6`}
                  name="creativeProcess"
                  defaultValue={business?.creative_process ?? ""}
                  maxLength={3000}
                  placeholder="Accompagna i visitatori dal primo schizzo all'opera finita."
                />
              </label>
            </div>}
          </EditorSection>

          <EditorSection
            number="03 — Branding e galleria"
            title="Mostra il lavoro nel suo contesto"
            description="Usa un logo chiaro, una copertina suggestiva e una selezione mirata di fotografie."
          >
            <StorefrontImageFields
              logoUrl={business?.logo_url ?? null}
              coverUrl={business?.cover_image_url ?? null}
            />
            <div className="border-t border-heather/10 pt-7">
              <StorefrontGalleryField imageUrls={galleryImageUrls} galleryItems={business?.gallery_items ?? []} businessName={business?.name ?? "Sito"} />
              {isOrganizer && <label className="mt-6 block text-sm font-semibold text-ink">Regione per le nuove foto<span className="font-normal text-ink/45"> (facoltativa)</span><input className={inputClassName} name="galleryRegion" maxLength={120} placeholder="es. Toscana" /><span className="mt-2 block text-xs font-normal text-ink/45">Le foto caricate insieme verranno associate a questa regione.</span></label>}
            </div>
          </EditorSection>

          <EditorSection
            number="04 — Contatti e social"
            title="Fatti trovare dai visitatori"
            description="Collega il tuo sito indipendente, i social, il negozio e il contatto pubblico preferito."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                URL del sito
                <input
                  className={inputClassName}
                  type="text"
                  inputMode="url"
                  name="websiteUrl"
                  defaultValue={business?.website_url ?? ""}
                  placeholder="https://yourwebsite.com"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                URL Instagram
                <input
                  className={inputClassName}
                  type="text"
                  inputMode="url"
                  name="instagramUrl"
                  defaultValue={business?.instagram_url ?? ""}
                  placeholder="https://instagram.com/yourprofile"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                URL negozio Etsy
                <input
                  className={inputClassName}
                  type="text"
                  inputMode="url"
                  name="etsyUrl"
                  defaultValue={business?.etsy_url ?? ""}
                  placeholder="https://etsy.com/shop/yourshop"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Email di contatto pubblica
                <input
                  className={inputClassName}
                  type="email"
                  name="contactEmail"
                  defaultValue={business?.contact_email ?? ""}
                  autoComplete="email"
                />
                <span className="mt-2 block text-xs font-normal text-ink/50">
                  Questo indirizzo potrebbe essere mostrato pubblicamente sul tuo sito.
                </span>
              </label>
            </div>
            {isOrganizer && <label className="text-sm font-semibold text-ink">Partner e sponsor<span className="font-normal text-ink/45"> (una riga per partner)</span><textarea className={`${inputClassName} min-h-32 resize-y py-3 leading-6`} name="partners" defaultValue={(business?.partners ?? []).map((partner) => [partner.name, partner.logo_url ?? "", partner.website_url ?? ""].join(" | ")).join("\n")} placeholder="Nome partner | URL logo | URL sito" /><span className="mt-2 block text-xs font-normal text-ink/45">Formato: Nome | link al logo | link al sito.</span></label>}
          </EditorSection>

          <EditorSection
            number="05 — Anteprima e pubblicazione"
            title="Pronto per la community?"
            description="Salva liberamente mentre il sito è una bozza. Pubblicandolo sarà visibile su Flowintoone."
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/45">
                  Elementi per la pubblicazione — ultimo salvataggio
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {publishingChecklist.map((item) => (
                    <li key={item.label} className="flex items-center gap-2 text-sm text-ink/65">
                      <span
                        className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                          item.complete
                            ? "bg-viridian/20 text-[#477b7b]"
                            : "bg-sandstone/60 text-ink/45"
                        }`}
                        aria-hidden="true"
                      >
                        {item.complete ? "✓" : "·"}
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-5 text-ink/45">
                  Questa lista si aggiorna dopo ogni salvataggio riuscito.
                </p>
              </div>

              {business?.status === "published" ? (
                <Link
                  href={`/${isOrganizer ? "organizers" : "artisans"}/${business.slug}`}
                  target="_blank"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-heather/25 px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
                >
                  Vedi sito pubblicato ↗
                </Link>
              ) : (
                business ? (
                  <Link href={`/dashboard/storefront/preview?businessId=${business.id}`} className="text-xs font-semibold text-heather underline decoration-heather/30 underline-offset-4">Anteprima bozza ↗</Link>
                ) : (
                  <p className="max-w-xs text-xs leading-5 text-ink/45">L&apos;anteprima pubblica sarà disponibile quando il sito verrà pubblicato.</p>
                )
              )}
            </div>

            <StorefrontSubmitButtons
              exists={Boolean(business)}
              isPublished={business?.status === "published"}
              disabled={categories.length === 0}
            />
          </EditorSection>
        </form>
      )}
    </section>
  );
}
