import Image from "next/image";
import Link from "next/link";
import { toggleProductFavoriteAction } from "@/app/products/actions";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { requireUser } from "@/lib/auth/session";

type FavoriteProduct = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  image_url: string | null;
  business: { name: string; slug: string } | { name: string; slug: string }[] | null;
  category: { name: string } | { name: string }[] | null;
};

function price(value: number | null) {
  if (value === null) return "Prezzo su richiesta";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value / 100);
}

function safeImageUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    return url.origin === supabaseUrl.origin ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function FavoritesPage() {
  const { supabase, userId } = await requireUser();
  const { data: favorites, error: favoritesError } = await supabase.from("product_favorites").select("product_id, created_at").eq("user_id", userId).order("created_at", { ascending: false });
  const productIds = (favorites ?? []).map((favorite) => favorite.product_id as string);
  let products: FavoriteProduct[] = [];
  let error = favoritesError;
  if (!error && productIds.length > 0) {
    const result = await supabase.from("products").select("id, code, name, description, price_cents, image_url, business:businesses(name, slug), category:product_categories(name)").in("id", productIds).eq("status", "published");
    error = result.error;
    products = (result.data ?? []) as FavoriteProduct[];
  }
  const order = new Map(productIds.map((id, index) => [id, index]));
  products.sort((first, second) => (order.get(first.id) ?? 0) - (order.get(second.id) ?? 0));

  return <section><div className="rounded-[1.35rem] border border-heather/15 bg-white/70 p-6 sm:p-9"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">La tua raccolta</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl">I miei preferiti<span className="text-candy">.</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">I prodotti che vuoi ritrovare, confrontare o acquistare più avanti.</p></div><Link href="/discover" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-heather px-4 text-xs font-semibold text-white"><DashboardIcon name="discover" className="size-4" />Scopri creator</Link></div>{error ? <div className="mt-8 rounded-2xl border border-candy/20 bg-candy/10 px-5 py-10 text-center text-sm">Non è stato possibile caricare i preferiti.</div> : products.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-heather/25 bg-cream/60 px-6 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-candy/10 text-2xl text-candy">♡</span><h2 className="mt-5 text-xl font-semibold text-ink">Non hai ancora salvato prodotti.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">Quando trovi qualcosa che ti piace, premi il cuore per ritrovarlo qui.</p><Link href="/discover" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-heather px-6 text-sm font-semibold text-white">Esplora i creator</Link></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => { const business = Array.isArray(product.business) ? product.business[0] : product.business; const category = Array.isArray(product.category) ? product.category[0] : product.category; const imageUrl = safeImageUrl(product.image_url); return <article key={product.id} className="overflow-hidden rounded-2xl border border-heather/15 bg-white/80"><Link href={business ? `/artisans/${business.slug}` : "/discover"} className="group block"><div className="relative aspect-[4/3] overflow-hidden bg-sandstone/30">{imageUrl ? <Image src={imageUrl} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <div className="absolute inset-0 grid place-items-center text-4xl text-heather/50">✦</div>}</div></Link><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-heather">{category?.name || "Prodotto"} · {product.code}</p><h2 className="mt-1 text-lg font-semibold text-ink">{product.name}</h2></div><span className="text-lg leading-none text-candy">♥</span></div>{business && <p className="mt-2 text-xs font-semibold text-ink/60">{business.name}</p>}<p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/65">{product.description || "Scopri questo prodotto sul sito del creator."}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink">{price(product.price_cents)}</span><form action={toggleProductFavoriteAction}><input type="hidden" name="productId" value={product.id} /><input type="hidden" name="businessSlug" value={business?.slug || "discover"} /><button type="submit" className="rounded-full border border-candy/25 px-3 py-1.5 text-[10px] font-semibold text-[#a95d76]">Rimuovi</button></form></div></div></article>; })}</div>}</div></section>;
}
