import Image from "next/image";
import { notFound } from "next/navigation";
import { requireArtisan } from "@/lib/auth/roles";

type PreviewPageProps = { searchParams: Promise<{ businessId?: string }> };

export default async function StorefrontPreviewPage({ searchParams }: PreviewPageProps) {
  const { supabase, userId } = await requireArtisan();
  const params = await searchParams;
  let query = supabase
    .from("businesses")
    .select("id, name, tagline, description, city, country, cover_image_url, logo_url, status, category:categories(name)")
    .eq("owner_id", userId)
    .limit(1);
  if (params.businessId) query = query.eq("id", params.businessId);
  const { data } = await query.maybeSingle();
  if (!data) notFound();
  const categoryValue = data.category as { name: string } | { name: string }[] | null;
  const category = Array.isArray(categoryValue) ? categoryValue[0]?.name : categoryValue?.name;

  return (
    <section className="w-full py-4 sm:py-8">
      <div className="rounded-[2rem] border border-heather/20 bg-white/70 p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">Private draft preview</p><span className="rounded-full bg-sandstone/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/60">{data.status}</span></div>
        <div className="relative mt-7 aspect-[16/6] overflow-hidden rounded-[1.5rem] bg-sandstone/30"><Image src={data.cover_image_url || "/images/storefront-fallback.svg"} alt="" fill className="object-cover" sizes="(min-width: 1024px) 900px, 100vw" /></div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-heather">{[category, data.city].filter(Boolean).join(" · ")}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em]">{data.name}</h1>
        {data.tagline && <p className="mt-4 text-xl leading-8 text-ink/70">{data.tagline}</p>}
        <p className="mt-8 whitespace-pre-line text-base leading-8 text-ink/75">{data.description || "Add your story in the editor."}</p>
        <p className="mt-8 border-t border-heather/10 pt-5 text-xs leading-5 text-ink/50">Only you can see this preview. It will not be available at the public artisan URL until you publish the website.</p>
      </div>
    </section>
  );
}
