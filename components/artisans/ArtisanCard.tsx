import Image from "next/image";
import Link from "next/link";

export type ArtisanSummary = {
  slug: string;
  businessName: string;
  category: string;
  city: string;
  imageSrc: string;
  imageAlt: string;
};

type ArtisanCardProps = {
  artisan: ArtisanSummary;
};

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-heather/15 bg-white/55 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-sandstone/30">
        <Image
          src={artisan.imageSrc}
          alt={artisan.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
          {artisan.category}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-ink">
          {artisan.businessName}
        </h3>
        <p className="mt-2 text-sm text-ink/60">{artisan.city}</p>
        <Link
          href={`/artisans/${artisan.slug}`}
          className="mt-5 inline-flex text-sm font-semibold text-ink underline decoration-heather/35 underline-offset-4 transition-colors hover:text-heather focus-visible:outline-2"
        >
          Visit storefront <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
