import Link from "next/link";
import { StorefrontNameField } from "@/components/dashboard/StorefrontNameField";
import { StorefrontSubmitButtons } from "@/components/dashboard/StorefrontSubmitButtons";
import { requireUser } from "@/lib/auth/session";
import { saveStorefrontAction } from "./actions";

type StorefrontPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

type StorefrontBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  city: string | null;
  country: string | null;
  website_url: string | null;
  instagram_url: string | null;
  contact_email: string | null;
  status: string;
};

type StorefrontCategory = {
  id: string;
  name: string;
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-heather focus:outline-2";

export default async function StorefrontPage({ searchParams }: StorefrontPageProps) {
  const { supabase, userId } = await requireUser();
  const params = await searchParams;
  const [businessResult, categoriesResult] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id, name, slug, description, category_id, city, country, website_url, instagram_url, contact_email, status",
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);
  const business = businessResult.data as StorefrontBusiness | null;
  const categories = (categoriesResult.data ?? []) as StorefrontCategory[];
  const hasLoadError = Boolean(businessResult.error || categoriesResult.error);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4"
      >
        ← Back to dashboard
      </Link>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
          {business ? "Storefront settings" : "New storefront"}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
            {business ? "Tell your story." : "Create your storefront."}
          </h1>
          {business && (
            <span className="rounded-full bg-sandstone/55 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-ink/65">
              {business.status}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/60">
          Your draft is private. Publish it only when the essential business information is
          complete and ready for visitors.
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
          The storefront editor could not be loaded. Confirm that the reviewed RLS migration
          has been applied, then try again.
        </div>
      ) : (
        <form
          action={saveStorefrontAction}
          className="mt-8 grid gap-7 rounded-[2rem] border border-heather/15 bg-white/65 p-6 sm:p-10"
        >
          {business && <input type="hidden" name="businessId" value={business.id} />}

          <StorefrontNameField
            initialName={business?.name ?? ""}
            initialSlug={business?.slug ?? null}
          />

          <label className="text-sm font-semibold text-ink">
            Description
            <textarea
              className={`${inputClassName} min-h-40 resize-y py-3`}
              name="description"
              defaultValue={business?.description ?? ""}
              maxLength={2000}
              placeholder="Share the story, materials, and care behind your work."
            />
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
              />
            </label>
            <label className="text-sm font-semibold text-ink">
              Country
              <input
                className={inputClassName}
                name="country"
                defaultValue={business?.country ?? ""}
                maxLength={120}
              />
            </label>
          </div>

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
          </div>

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

          <StorefrontSubmitButtons
            exists={Boolean(business)}
            isPublished={business?.status === "published"}
            disabled={categories.length === 0}
          />
        </form>
      )}
    </main>
  );
}
