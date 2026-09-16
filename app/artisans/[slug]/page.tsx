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
  description: string | null;
  city: string | null;
  country: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  instagram_url: string | null;
  contact_email: string | null;
  category: { name: string } | { name: string }[] | null;
};

export const revalidate = 300;

const getPublishedStorefront = cache(async (slug: string) => {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      "id, name, slug, description, city, country, logo_url, cover_image_url, website_url, instagram_url, contact_email, category:categories(name)",
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
    throw new Error("The storefront could not be loaded.");
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

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const storefront = await getPublishedStorefront(slug);

  if (!storefront) {
    return { title: "Storefront not found | Flowintoone" };
  }

  return {
    title: `${storefront.name} | Flowintoone`,
    description:
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
  const publicEmail = safePublicEmail(storefront.contact_email);

  return (
    <>
      <Header />
      <main className="bg-cream pb-24">
        <section className="px-5 pt-8 sm:px-8 sm:pt-12 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <Link
              href="/#artisans"
              className="inline-flex text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4 focus-visible:outline-2"
            >
              ← Back to artisans
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
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1060px] gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
            <div>
              <div className="-mt-14 flex flex-col items-start sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
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

                <div className="mt-5 pb-1 sm:mt-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
                    {[relatedCategory?.name, storefront.city].filter(Boolean).join(" · ")}
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                    {storefront.name}<span className="text-candy">.</span>
                  </h1>
                  <p className="mt-3 text-sm text-ink/55">
                    {[storefront.city, storefront.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>

              <article className="mt-12 border-t border-heather/15 pt-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
                  About the artisan
                </p>
                <p className="mt-5 whitespace-pre-line text-base leading-8 text-ink/75 sm:text-lg">
                  {storefront.description || "This artisan has not added their story yet."}
                </p>
              </article>
            </div>

            <aside className="h-fit rounded-[2rem] bg-white/65 p-7 lg:mt-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">
                Connect
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink">
                Find their work.
              </h2>

              {websiteUrl || instagramUrl || publicEmail ? (
                <div className="mt-6 grid gap-3">
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-between rounded-full border border-heather/20 px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
                    >
                      Website <span aria-hidden="true">↗</span>
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
                  Contact details have not been added yet.
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
