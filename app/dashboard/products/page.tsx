import Link from "next/link";
import {
  createProductAction,
  createProductCategoryAction,
  deleteProductAction,
  toggleProductStatusAction,
} from "./actions";
import { requireArtisan } from "@/lib/auth/roles";

type ProductCategory = { id: string; name: string };
type Product = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  image_url: string | null;
  status: string;
  category: { name: string } | { name: string }[] | null;
};

function price(value: number | null) {
  if (value === null) return "Prezzo su richiesta";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value / 100);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const { supabase, userId } = await requireArtisan();
  const params = await searchParams;
  const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle();
  const [categoriesResult, productsResult] = business
    ? await Promise.all([
        supabase.from("product_categories").select("id, name").eq("business_id", business.id).order("sort_order").order("name"),
        supabase.from("products").select("id, code, name, description, price_cents, image_url, status, category:product_categories(name)").eq("business_id", business.id).order("created_at", { ascending: false }),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  const categories = (categoriesResult.data ?? []) as ProductCategory[];
  const products = (productsResult.data ?? []) as Product[];

  return (
    <section className="w-full py-4 sm:py-8">
      <Link href="/dashboard" className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4">← Torna alla dashboard</Link>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">Il mio catalogo</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink">Prodotti<span className="text-candy">.</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Aggiungi ciò che vendi, assegna una categoria e pubblica solo i prodotti pronti per il tuo sito.</p></div>
        <Link href="/dashboard/storefront" className="text-xs font-semibold text-heather underline decoration-heather/30 underline-offset-4">Modifica il sito ↗</Link>
      </div>
      {(params.error || params.message) && <p role={params.error ? "alert" : "status"} className={`mt-6 rounded-xl border px-4 py-3 text-sm ${params.error ? "border-candy/25 bg-candy/10" : "border-viridian/25 bg-viridian/10"}`}>{params.error || params.message}</p>}

      {!business ? <div className="mt-8 rounded-2xl border border-dashed border-heather/25 bg-white/55 p-10 text-center text-sm text-ink/65">Crea prima il tuo sito per aggiungere prodotti.</div> : <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-4">
          {products.length === 0 ? <div className="rounded-2xl border border-dashed border-heather/25 bg-white/55 p-10 text-center"><p className="text-lg font-semibold text-ink">Il catalogo è ancora vuoto.</p><p className="mt-2 text-sm text-ink/60">Il primo prodotto apparirà qui.</p></div> : products.map((product) => { const category = Array.isArray(product.category) ? product.category[0] : product.category; return <article key={product.id} className="rounded-2xl border border-heather/15 bg-white/75 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-heather">{category?.name || "Senza categoria"} · {product.code}</p><h2 className="mt-1 text-xl font-semibold text-ink">{product.name}</h2><p className="mt-2 text-sm text-ink/65">{product.description || "Nessuna descrizione."}</p></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${product.status === "published" ? "bg-viridian/15 text-[#477b7b]" : "bg-sandstone/60 text-ink/60"}`}>{product.status === "published" ? "pubblicato" : "bozza"}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-heather/10 pt-4"><span className="text-sm font-semibold text-ink">{price(product.price_cents)}</span><div className="flex flex-wrap gap-2"><form action={toggleProductStatusAction}><input type="hidden" name="productId" value={product.id} /><button type="submit" className="rounded-full border border-heather/25 px-3 py-2 text-xs font-semibold text-heather">{product.status === "published" ? "Metti in bozza" : "Pubblica"}</button></form><form action={deleteProductAction}><input type="hidden" name="productId" value={product.id} /><button type="submit" className="rounded-full border border-candy/25 px-3 py-2 text-xs font-semibold text-[#a95d76]">Elimina</button></form></div></div></article>; })}
        </div>
        <aside className="h-fit rounded-2xl border border-heather/15 bg-white/75 p-5"><h2 className="text-lg font-semibold text-ink">Nuovo prodotto</h2><form action={createProductAction} className="mt-5 grid gap-3"><label className="text-xs font-semibold">Codice prodotto<input name="code" required placeholder="CER-001" className="mt-1 min-h-10 w-full rounded-lg border border-heather/20 bg-white px-3 text-sm" /></label><label className="text-xs font-semibold">Nome<input name="name" required placeholder="Tazza in ceramica" className="mt-1 min-h-10 w-full rounded-lg border border-heather/20 bg-white px-3 text-sm" /></label><label className="text-xs font-semibold">Categoria<select name="categoryId" className="mt-1 min-h-10 w-full rounded-lg border border-heather/20 bg-white px-3 text-sm"><option value="">Senza categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="text-xs font-semibold">Prezzo (€)<input name="price" inputMode="decimal" placeholder="38,00" className="mt-1 min-h-10 w-full rounded-lg border border-heather/20 bg-white px-3 text-sm" /></label><label className="text-xs font-semibold">Link immagine <span className="font-normal text-ink/45">(facoltativo)</span><input name="imageUrl" type="url" placeholder="https://…" className="mt-1 min-h-10 w-full rounded-lg border border-heather/20 bg-white px-3 text-sm" /></label><label className="text-xs font-semibold">Descrizione<textarea name="description" rows={3} className="mt-1 w-full rounded-lg border border-heather/20 bg-white px-3 py-2 text-sm" /></label><div className="grid grid-cols-2 gap-2"><button name="status" value="draft" className="min-h-10 rounded-full border border-heather/25 text-xs font-semibold text-heather">Salva bozza</button><button name="status" value="published" className="min-h-10 rounded-full bg-heather text-xs font-semibold text-white">Pubblica</button></div></form><div className="mt-6 border-t border-heather/10 pt-5"><h3 className="text-sm font-semibold text-ink">Categorie prodotto</h3><form action={createProductCategoryAction} className="mt-3 flex gap-2"><input name="name" required placeholder="es. Gioielli" className="min-h-10 min-w-0 flex-1 rounded-lg border border-heather/20 bg-white px-3 text-xs" /><button className="rounded-lg bg-sandstone px-3 text-xs font-semibold text-ink">Aggiungi</button></form>{categories.length > 0 && <p className="mt-3 text-[11px] leading-5 text-ink/50">{categories.map((category) => category.name).join(" · ")}</p>}</div></aside>
      </div>}
    </section>
  );
}
