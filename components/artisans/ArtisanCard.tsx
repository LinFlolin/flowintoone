import Image from "next/image";
import Link from "next/link";
import type { HomepageBusiness } from "@/lib/data/homepage";

type ArtisanCardProps = {
  artisan: HomepageBusiness;
};

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="group overflow-hidden rounded-2xl border border-heather/15 bg-white/55 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2"
      aria-label={`Visit ${artisan.businessName} storefront`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sandstone/30">
        <Image
          src={artisan.imageSrc}
          alt={`${artisan.businessName} storefront`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      </div>
      <div className="p-5">
        {artisan.category && (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
            {artisan.category}
          </p>
        )}
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-ink">
          {artisan.businessName}
        </h3>
        {artisan.city && <p className="mt-2 text-sm text-ink/60">{artisan.city}</p>}
        <span className="mt-5 inline-flex text-sm font-semibold text-ink underline decoration-heather/35 underline-offset-4 transition-colors group-hover:text-heather">
          Visit storefront <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}
