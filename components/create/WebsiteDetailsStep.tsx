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
  shop: "Shop",
  events: "Events",
  portfolio: "Portfolio",
  services: "Services",
  personal: "Personal",
};
const inputClassName = "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-heather focus:outline-2";

function Progress() {
  return (
    <ol className="mt-9 grid grid-cols-4 gap-2 sm:mt-11 sm:gap-6" aria-label="Website creation progress">
      {["Purpose", "Details", "Design", "Review"].map((label, index) => {
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
    if (details.name.trim().length < 2) return setError("Enter a website or business name.");
    if (!details.description.trim()) return setError("Add a short description of your work.");
    if (!details.categoryId) return setError("Select a category.");
    if (!details.city.trim() || !details.country.trim()) return setError("Add your city and country.");
    if (!details.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(details.slug)) return setError("Use a valid public URL slug.");
    if (!writeCreateFlowState({ purpose, details, step: "design" })) {
      return setError("We could not save your progress. Check your browser settings and try again.");
    }
    router.push("/create/design");
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-4xl rounded-[2rem] border border-heather/10 bg-white/35 px-5 py-8 shadow-[0_20px_70px_rgba(81,68,91,0.06)] sm:min-h-[calc(100vh-4rem)] sm:px-12 sm:py-12">
        <div className="flex items-center justify-between gap-4"><Link href="/create" className="text-xs font-semibold text-ink/55 hover:text-heather">← Back</Link><Link href="/dashboard" className="text-xs font-semibold text-ink/55 hover:text-heather">Save and exit</Link></div>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-heather">Step 2 of 4</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Tell us about your website</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">These are the same details used by your storefront editor. You can refine them later.</p>
        <Progress />
        <form onSubmit={continueToDesign} className="mt-10 grid gap-7">
          <section className="grid gap-6 rounded-2xl border border-heather/15 bg-white/55 p-5 sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-heather">{purpose ? purposeLabels[purpose] : "Website"}</p>
              <h2 className="mt-2 text-2xl font-semibold">The essentials</h2>
            </div>
            <label className="text-sm font-semibold">Website or business name <span className="text-candy">*</span><input className={inputClassName} name="name" value={details.name} onChange={(event) => update("name", event.target.value)} maxLength={100} required /></label>
            <label className="text-sm font-semibold">Tagline <span className="font-normal text-ink/45">(optional)</span><input className={inputClassName} name="tagline" value={details.tagline} onChange={(event) => update("tagline", event.target.value)} maxLength={160} /></label>
            <label className="text-sm font-semibold">Description <span className="text-candy">*</span><textarea className={`${inputClassName} min-h-36 resize-y py-3 leading-6`} name="description" value={details.description} onChange={(event) => update("description", event.target.value)} maxLength={4000} required /></label>
            <div className="grid gap-6 sm:grid-cols-3">
              <label className="text-sm font-semibold">Category <span className="text-candy">*</span><select className={inputClassName} name="categoryId" value={details.categoryId} onChange={(event) => update("categoryId", event.target.value)} required><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label className="text-sm font-semibold">City <span className="text-candy">*</span><input className={inputClassName} name="city" value={details.city} onChange={(event) => update("city", event.target.value)} maxLength={120} required /></label>
              <label className="text-sm font-semibold">Country <span className="text-candy">*</span><input className={inputClassName} name="country" value={details.country} onChange={(event) => update("country", event.target.value)} maxLength={120} required /></label>
            </div>
          </section>
          <section className="grid gap-6 rounded-2xl border border-heather/15 bg-white/55 p-5 sm:p-7">
            <div><h2 className="text-2xl font-semibold">Your story and links</h2><p className="mt-2 text-sm leading-6 text-ink/55">Optional details can be completed later in the editor.</p></div>
            <div className="grid gap-6 lg:grid-cols-2"><label className="text-sm font-semibold">Materials<textarea className={`${inputClassName} min-h-28 resize-y py-3`} name="materials" value={details.materials} onChange={(event) => update("materials", event.target.value)} maxLength={2000} /></label><label className="text-sm font-semibold">Creative process<textarea className={`${inputClassName} min-h-28 resize-y py-3`} name="creativeProcess" value={details.creativeProcess} onChange={(event) => update("creativeProcess", event.target.value)} maxLength={3000} /></label></div>
            <div className="grid gap-6 sm:grid-cols-2"><label className="text-sm font-semibold">Website URL<input className={inputClassName} name="websiteUrl" value={details.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} inputMode="url" /></label><label className="text-sm font-semibold">Instagram URL<input className={inputClassName} name="instagramUrl" value={details.instagramUrl} onChange={(event) => update("instagramUrl", event.target.value)} inputMode="url" /></label><label className="text-sm font-semibold">Etsy shop URL<input className={inputClassName} name="etsyUrl" value={details.etsyUrl} onChange={(event) => update("etsyUrl", event.target.value)} inputMode="url" /></label><label className="text-sm font-semibold">Public contact email<input className={inputClassName} type="email" name="contactEmail" value={details.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} /></label></div>
          </section>
          <section className="rounded-2xl border border-heather/15 bg-white/55 p-5 sm:p-7"><label className="text-sm font-semibold">Public URL slug <span className="text-candy">*</span><input className={inputClassName} name="slug" value={details.slug} onChange={(event) => update("slug", normalizeStorefrontSlug(event.target.value))} maxLength={80} required /></label><p className="mt-2 text-xs text-ink/50">Your public URL will be /artisans/{details.slug || "your-name"}.</p></section>
          <div className="flex flex-col gap-4 border-t border-heather/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-sm text-xs leading-5 text-ink/50">Your progress is saved in this browser while you move through the wizard.</p><div className="flex flex-col gap-3 sm:flex-row sm:items-center">{error && <p role="alert" className="text-xs text-candy">{error}</p>}<button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-heather px-6 text-sm font-semibold text-white hover:bg-[#756486]">Next step →</button></div></div>
        </form>
      </div>
    </main>
  );
}
