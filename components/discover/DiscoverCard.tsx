import Image from "next/image";
import Link from "next/link";
import type { HomepageBusiness } from "@/lib/data/homepage";

type DiscoverCardProps = {
  artisan: HomepageBusiness;
};

export function DiscoverCard({ artisan }: DiscoverCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-heather/15 bg-white/65 transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/artisans/${artisan.slug}`} className="block focus-visible:outline-2" aria-label={`Vedi il sito di ${artisan.businessName}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-sandstone/30">
          <Image
            src={artisan.imageSrc}
            alt={`${artisan.businessName} website cover`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {artisan.category && (
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-heather">
                {artisan.category}
              </p>
            )}
            <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.03em] text-ink">
              {artisan.businessName}
            </h2>
          </div>
          <span className="mt-1 text-sm text-heather" aria-hidden="true">♡</span>
        </div>
        {(artisan.city || artisan.country) && (
          <p className="mt-2 text-xs font-medium text-ink/70">
            {[artisan.city, artisan.country].filter(Boolean).join(", ")}
          </p>
        )}
        {artisan.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/70">{artisan.description}</p>
        )}
        <Link
          href={`/artisans/${artisan.slug}`}
          className="mt-5 inline-flex text-xs font-semibold text-ink underline decoration-heather/35 underline-offset-4 transition-colors hover:text-heather focus-visible:outline-2"
        >
          Vedi il sito <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
