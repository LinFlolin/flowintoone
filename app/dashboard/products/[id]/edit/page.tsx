import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProductAction } from "../../actions";
import { requireArtisan } from "@/lib/auth/roles";

type EditProductPageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const { supabase, userId } = await requireArtisan();
  const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (!business) notFound();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id, code, name, description, price_cents, image_url, category_id, status").eq("id", id).eq("business_id", business.id).maybeSingle(),
    supabase.from("product_categories").select("id, name").eq("business_id", business.id).order("sort_order").order("name"),
  ]);
  if (!product) notFound();

  return (
    <section className="w-full py-4 sm:py-8">
      <Link href="/dashboard/products" className="text-sm font-semibold text-heather underline decoration-heather/30 underline-offset-4">← Torna ai prodotti</Link>
      <div className="mt-8 max-w-2xl rounded-2xl border border-heather/15 bg-white/75 p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">Catalogo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-ink">Modifica prodotto<span className="text-candy">.</span></h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">Aggiorna i dati del prodotto. Carica una nuova immagine solo se vuoi sostituire quella attuale.</p>
        <form action={updateProductAction} className="mt-8 grid gap-4">
          <input type="hidden" name="productId" value={product.id} />
          {product.image_url && <div className="relative aspect-[4/3] max-w-sm overflow-hidden rounded-xl bg-sandstone/30"><Image src={product.image_url} alt={product.name} fill sizes="384px" className="object-cover" /></div>}
          <label className="text-sm font-semibold text-ink">Nome<input name="name" required defaultValue={product.name} className="mt-2 min-h-11 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm" /></label>
          <label className="text-sm font-semibold text-ink">Codice prodotto<input name="code" required defaultValue={product.code} className="mt-2 min-h-11 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm" /></label>
          <label className="text-sm font-semibold text-ink">Categoria<select name="categoryId" defaultValue={product.category_id ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm"><option value="">Senza categoria</option>{(categories ?? []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="text-sm font-semibold text-ink">Prezzo (€)<input name="price" inputMode="decimal" defaultValue={product.price_cents === null ? "" : String(Number(product.price_cents) / 100).replace(".", ",")} className="mt-2 min-h-11 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm" /></label>
          <label className="text-sm font-semibold text-ink">Nuova immagine <span className="font-normal text-ink/45">(facoltativa)</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full cursor-pointer rounded-xl border border-heather/20 bg-white px-3 py-3 text-xs file:mr-3 file:rounded-full file:border-0 file:bg-sandstone/45 file:px-4 file:py-2 file:text-xs file:font-semibold" /></label>
          <label className="text-sm font-semibold text-ink">Descrizione<textarea name="description" rows={5} defaultValue={product.description ?? ""} className="mt-2 w-full rounded-xl border border-heather/20 bg-white px-4 py-3 text-sm" /></label>
          <div className="flex flex-wrap justify-end gap-3 border-t border-heather/10 pt-5"><Link href="/dashboard/products" className="inline-flex min-h-11 items-center rounded-full border border-heather/25 px-5 text-sm font-semibold text-ink/70">Annulla</Link><button type="submit" className="min-h-11 rounded-full bg-heather px-6 text-sm font-semibold text-white">Salva modifiche</button></div>
        </form>
      </div>
    </section>
  );
}
