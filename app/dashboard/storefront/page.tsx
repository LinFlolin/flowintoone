import Link from "next/link";
import type { ReactNode } from "react";
import { StorefrontGalleryField } from "@/components/dashboard/StorefrontGalleryField";
import { StorefrontImageFields } from "@/components/dashboard/StorefrontImageFields";
import { StorefrontNameField } from "@/components/dashboard/StorefrontNameField";
import { StorefrontSubmitButtons } from "@/components/dashboard/StorefrontSubmitButtons";
import { requireArtisan } from "@/lib/auth/roles";
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
  city: string | null;
  country: string | null;
  website_url: string | null;
  instagram_url: string | null;
  etsy_url: string | null;
  contact_email: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery_image_urls: string[] | null;
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
  const { supabase, userId } = await requireArtisan();
  const params = await searchParams;
  const businessQuery = supabase
    .from("businesses")
    .select(
      "id, name, slug, tagline, description, materials, creative_process, category_id, city, country, website_url, instagram_url, etsy_url, contact_email, logo_url, cover_image_url, gallery_image_urls, status",
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
  const publishingChecklist = [
    { label: "Business name", complete: Boolean(business?.name.trim()) },
    { label: "Category", complete: Boolean(business?.category_id) },
    { label: "Our story", complete: Boolean(business?.description?.trim()) },
    { label: "City", complete: Boolean(business?.city?.trim()) },
    { label: "Country", complete: Boolean(business?.country?.trim()) },
  ];

  return (
    <section className="w-full py-4 sm:py-8">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
      >
        ← Back to dashboard
      </Link>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          {business ? "Storefront editor" : "New storefront"}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
            Shape your storefront<span className="text-candy">.</span>
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
          Build an editorial home for your work, from the ideas and materials behind it to
          the photographs that bring it to life.
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
          The storefront editor could not be loaded. Confirm that the Storefront 2.0
          migration has been applied, then try again.
        </div>
      ) : (
        <form action={saveStorefrontAction} className="mt-10 grid gap-6">
          {business && <input type="hidden" name="businessId" value={business.id} />}

          <EditorSection
            number="01 — Business information"
            title="The essentials"
            description="Set the identity, category, and location visitors use to understand your business at a glance."
          >
            <StorefrontNameField
              initialName={business?.name ?? ""}
              initialSlug={business?.slug ?? null}
            />

            <label className="text-sm font-semibold text-ink">
              Tagline <span className="font-normal text-ink/45">(optional)</span>
              <input
                className={inputClassName}
                name="tagline"
                defaultValue={business?.tagline ?? ""}
                maxLength={160}
                placeholder="Small-batch ceramics inspired by the Mediterranean coast."
              />
              <span className="mt-2 block text-xs font-normal text-ink/45">
                A short introduction shown prominently on your public storefront.
              </span>
            </label>

            <div className="grid gap-6 sm:grid-cols-3">
              <label className="text-sm font-semibold text-ink sm:col-span-1">
                Category <span className="text-candy">*</span>
                <select
                  className={inputClassName}
                  name="categoryId"
                  defaultValue={business?.category_id ?? categories[0]?.id ?? ""}
                  aria-describedby={categories.length === 0 ? "category-unavailable" : undefined}
                  required
                >
                  <option value="" disabled>
                    {categories.length === 0 ? "No categories available" : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <span id="category-unavailable" className="mt-2 block text-xs font-normal text-candy">
                    No active categories are available. Saving is disabled.
                  </span>
                )}
              </label>
              <label className="text-sm font-semibold text-ink">
                City
                <input
                  className={inputClassName}
                  name="city"
                  defaultValue={business?.city ?? ""}
                  maxLength={120}
                  autoComplete="address-level2"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Country
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
            number="02 — Our story"
            title="The meaning behind the work"
            description="Share the human story, material choices, and process that make your practice distinctive."
          >
            <label className="text-sm font-semibold text-ink">
              Your story
              <textarea
                className={`${inputClassName} min-h-48 resize-y py-3 leading-6`}
                name="description"
                defaultValue={business?.description ?? ""}
                maxLength={4000}
                placeholder="How did your practice begin? What ideas and places continue to shape it?"
              />
              <span className="mt-2 block text-xs font-normal text-ink/45">
                Required before publishing.
              </span>
            </label>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                Materials <span className="font-normal text-ink/45">(optional)</span>
                <textarea
                  className={`${inputClassName} min-h-36 resize-y py-3 leading-6`}
                  name="materials"
                  defaultValue={business?.materials ?? ""}
                  maxLength={2000}
                  placeholder="Describe the materials you choose, where they come from, and why they matter."
                />
              </label>

              <label className="text-sm font-semibold text-ink">
                Creative process <span className="font-normal text-ink/45">(optional)</span>
                <textarea
                  className={`${inputClassName} min-h-36 resize-y py-3 leading-6`}
                  name="creativeProcess"
                  defaultValue={business?.creative_process ?? ""}
                  maxLength={3000}
                  placeholder="Take visitors from the first sketch to the finished piece."
                />
              </label>
            </div>
          </EditorSection>

          <EditorSection
            number="03 — Branding & gallery"
            title="Show the work in context"
            description="Use a clear logo, an atmospheric cover, and a focused selection of photographs."
          >
            <StorefrontImageFields
              logoUrl={business?.logo_url ?? null}
              coverUrl={business?.cover_image_url ?? null}
            />
            <div className="border-t border-heather/10 pt-7">
              <StorefrontGalleryField
                imageUrls={galleryImageUrls}
                businessName={business?.name ?? "Storefront"}
              />
            </div>
          </EditorSection>

          <EditorSection
            number="04 — Contact & social"
            title="Help visitors find you"
            description="Connect your independent website, social presence, shop, and preferred public contact address."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                Website URL
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
                Instagram URL
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
                Etsy shop URL
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
                Public contact email
                <input
                  className={inputClassName}
                  type="email"
                  name="contactEmail"
                  defaultValue={business?.contact_email ?? ""}
                  autoComplete="email"
                />
                <span className="mt-2 block text-xs font-normal text-ink/50">
                  This address may be displayed publicly on your storefront.
                </span>
              </label>
            </div>
          </EditorSection>

          <EditorSection
            number="05 — Preview & publish"
            title="Ready for the community?"
            description="Save freely while the storefront is a draft. Publishing makes it discoverable on Flowintoone."
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/45">
                  Publishing essentials — last saved state
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
                  This checklist refreshes after each successful save.
                </p>
              </div>

              {business?.status === "published" ? (
                <Link
                  href={`/artisans/${business.slug}`}
                  target="_blank"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-heather/25 px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
                >
                  View live storefront ↗
                </Link>
              ) : (
                business ? (
                  <Link href={`/dashboard/storefront/preview?businessId=${business.id}`} className="text-xs font-semibold text-heather underline decoration-heather/30 underline-offset-4">Preview draft ↗</Link>
                ) : (
                  <p className="max-w-xs text-xs leading-5 text-ink/45">The public preview becomes available as soon as the storefront is published.</p>
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
