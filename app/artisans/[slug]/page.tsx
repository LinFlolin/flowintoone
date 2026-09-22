import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

type StorefrontPageProps = {
  params: Promise<{ slug: string }>;
};

type PublicStorefront = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  materials: string | null;
  creative_process: string | null;
  city: string | null;
  country: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery_image_urls: string[] | null;
  website_url: string | null;
  instagram_url: string | null;
  etsy_url: string | null;
  contact_email: string | null;
  category: { name: string } | { name: string }[] | null;
};

export const revalidate = 300;

const getPublishedStorefront = cache(async (slug: string) => {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      "id, name, slug, tagline, description, materials, creative_process, city, country, logo_url, cover_image_url, gallery_image_urls, website_url, instagram_url, etsy_url, contact_email, category:categories(name)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      `[storefront:public-read] Supabase query failed ${JSON.stringify({
        code: error.code ?? null,
        message: error.message ?? null,
      })}`,
    );
    throw new Error("Non è stato possibile caricare il sito.");
  }

  return data as PublicStorefront | null;
});

function safeExternalUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function safePublicEmail(value: string | null) {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

function safeEtsyUrl(value: string | null) {
  const safeUrl = safeExternalUrl(value);
  if (!safeUrl) return null;

  const hostname = new URL(safeUrl).hostname.toLowerCase();
  return hostname === "etsy.com" ||
    hostname.endsWith(".etsy.com") ||
    hostname === "etsy.me" ||
    hostname.endsWith(".etsy.me")
    ? safeUrl
    : null;
}

function safeGalleryImageUrl(value: unknown) {
  if (typeof value !== "string") return null;

  try {
    const imageUrl = new URL(value);
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const expectedPrefix = "/storage/v1/object/public/storefront-images/";

    return imageUrl.origin === supabaseUrl.origin && imageUrl.pathname.startsWith(expectedPrefix)
      ? imageUrl.toString()
      : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const storefront = await getPublishedStorefront(slug);

  if (!storefront) {
    return { title: "Storefront not found | Flowintoone" };
  }

  return {
    title: `${storefront.name} | Flowintoone`,
    description:
      storefront.tagline ||
      storefront.description?.slice(0, 160) ||
      `Discover ${storefront.name} on Flowintoone.`,
  };
}

export default async function ArtisanStorefrontPage({ params }: StorefrontPageProps) {
  const { slug } = await params;
  const storefront = await getPublishedStorefront(slug);

  if (!storefront) notFound();

  const relatedCategory = Array.isArray(storefront.category)
    ? storefront.category[0]
    : storefront.category;
  const websiteUrl = safeExternalUrl(storefront.website_url);
  const instagramUrl = safeExternalUrl(storefront.instagram_url);
  const etsyUrl = safeEtsyUrl(storefront.etsy_url);
  const publicEmail = safePublicEmail(storefront.contact_email);
  const galleryImages = (storefront.gallery_image_urls ?? [])
    .map(safeGalleryImageUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 6);

  return (
    <>
      <Header />
      <main className="bg-cream pb-24">
        <section className="px-5 pt-8 sm:px-8 sm:pt-12 lg:px-10">
          <div className="mx-auto max-w-[75%]">
            <Link
              href="/#artisans"
              className="inline-flex text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4 focus-visible:outline-2"
            >
              ← Torna ai creator
            </Link>

            <div className="relative mt-7 aspect-[16/7] min-h-64 overflow-hidden rounded-[2rem] bg-sandstone/35 sm:min-h-80">
              <Image
                src={storefront.cover_image_url || "/images/storefront-fallback.svg"}
                alt={`${storefront.name} cover`}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/25 to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_19rem] lg:gap-16">
            <div>
              <div className="-mt-14 flex flex-col items-start sm:-mt-16 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative z-10 size-28 shrink-0 overflow-hidden rounded-full border-[6px] border-cream bg-sandstone sm:size-36">
                  {storefront.logo_url ? (
                    <Image
                      src={storefront.logo_url}
                      alt={`${storefront.name} logo`}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-4xl font-semibold text-heather">
                      {storefront.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="mt-5 pb-1 sm:mt-0 sm:pt-20">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
                    {[relatedCategory?.name, storefront.city].filter(Boolean).join(" · ")}
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl lg:text-6xl">
                    {storefront.name}<span className="text-candy">.</span>
                  </h1>
                  <p className="mt-3 text-sm text-ink/55">
                    {[storefront.city, storefront.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>

              {storefront.tagline && (
                <p className="mt-10 max-w-3xl text-2xl font-medium leading-9 tracking-[-0.025em] text-ink sm:text-3xl sm:leading-10">
                  {storefront.tagline}
                </p>
              )}
            </div>

            <aside className="h-fit rounded-[2rem] bg-white/65 p-7 lg:mt-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">
                Connettiti
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
                Scopri il loro lavoro.
              </h2>

              {websiteUrl || instagramUrl || etsyUrl || publicEmail ? (
                <div className="mt-6 grid gap-3">
                  {etsyUrl && (
                    <a
                      href={etsyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-between rounded-full bg-heather px-5 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
                    >
                      Acquista su Etsy <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-between rounded-full border border-heather/20 px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
                    >
                      Sito web <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-between rounded-full border border-heather/20 px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
                    >
                      Instagram <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {publicEmail && (
                    <a
                      href={`mailto:${publicEmail}`}
                      className="break-all px-1 py-2 text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4 focus-visible:outline-2"
                    >
                      {publicEmail}
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-ink/55">
                  I dettagli di contatto non sono ancora disponibili.
                </p>
              )}
            </aside>
          </div>
        </section>

        <section className="px-5 pt-20 sm:px-8 sm:pt-28 lg:px-10">
          <div className="mx-auto grid max-w-[1100px] gap-10 border-t border-heather/15 pt-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
                La nostra storia
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">
                Creato con cura.
              </h2>
            </div>
            <p className="whitespace-pre-line text-base leading-8 text-ink/75 sm:text-lg sm:leading-9">
              {storefront.description || "Questo creator non ha ancora aggiunto la propria storia."}
            </p>
          </div>
        </section>

        {(storefront.materials || storefront.creative_process) && (
          <section className="px-5 pt-16 sm:px-8 sm:pt-20 lg:px-10">
            <div className="mx-auto grid max-w-[1100px] gap-5 md:grid-cols-2">
              {storefront.materials && (
                <article className="rounded-[2rem] bg-sandstone/30 p-7 sm:p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
                    Materiali
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
                    Scelti con cura.
                  </h2>
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-ink/70 sm:text-base">
                    {storefront.materials}
                  </p>
                </article>
              )}

              {storefront.creative_process && (
                <article className="rounded-[2rem] bg-viridian/10 p-7 sm:p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#477b7b]">
                    Processo creativo
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
                    Dall&apos;idea all&apos;oggetto.
                  </h2>
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-ink/70 sm:text-base">
                    {storefront.creative_process}
                  </p>
                </article>
              )}
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className="px-5 pt-20 sm:px-8 sm:pt-28 lg:px-10">
            <div className="mx-auto max-w-[1200px]">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
                  From the studio
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
                  Il lavoro da vicino<span className="text-candy">.</span>
                </h2>
              </div>

              <div className="mt-10 grid auto-rows-[14rem] gap-4 sm:grid-cols-2 sm:auto-rows-[18rem] lg:grid-cols-3">
                {galleryImages.map((imageUrl, index) => (
                  <figure
                    key={imageUrl}
                    className={`relative overflow-hidden rounded-[1.75rem] bg-sandstone/30 ${
                      index === 0 && galleryImages.length > 1
                        ? "sm:row-span-2 lg:col-span-2"
                        : ""
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${storefront.name} work ${index + 1}`}
                      fill
                      sizes={
                        index === 0 && galleryImages.length > 1
                          ? "(min-width: 1024px) 800px, (min-width: 640px) 50vw, 100vw"
                          : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      }
                      className="object-cover"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
