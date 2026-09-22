import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-heather/10">
      <div
        className="absolute -left-20 top-24 size-52 rounded-full bg-sandstone/35 blur-3xl"
        aria-hidden="true"
      />
      <ScrollReveal className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-heather">
            Il tuo spazio. La tua storia. Le tue possibilità.
          </p>
          <h1 className="max-w-2xl text-[clamp(2.65rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">
            Il tuo posto per crescere online<span className="flow-dot-pulse text-candy">.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-ink/80 sm:text-lg sm:leading-8">
            Crea un sito che racconti chi sei e cosa fai. Mostra il tuo lavoro,
            condividi la tua storia e connettiti con le persone giuste.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-7 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
            >
              Crea il tuo sito
            </Link>
            <Link
              href="/discover"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-heather/35 px-7 text-sm font-semibold text-ink transition-colors hover:border-heather hover:bg-white/55 focus-visible:outline-2"
            >
              Esplora i siti
            </Link>
          </div>
        </div>

        <ScrollReveal className="flow-scroll-fade relative mx-auto w-full max-w-3xl lg:mx-0" delay={180}>
          <div
            className="flow-soft-pulse absolute -right-3 -top-3 size-20 rounded-tr-[2.75rem] bg-viridian/45 sm:-right-5 sm:-top-5 sm:size-28"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] rounded-br-[5rem] sm:rounded-[2.25rem] sm:rounded-br-[7rem]">
            <Image
              src="/images/Hero-image.jpg"
              alt="An independent artist arranging botanical prints at a studio table"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative -mt-7 ml-5 mr-10 flex max-w-sm items-center gap-3 rounded-2xl border border-heather/10 bg-[#fffdf9] px-5 py-4 sm:-mt-8 sm:ml-8">
            <span className="size-2.5 shrink-0 rounded-full bg-candy" aria-hidden="true" />
            <p className="text-xs font-semibold leading-5 text-ink/85 sm:text-sm">
              Persone vere. Storie autentiche. Un web più gentile.
            </p>
          </div>
        </ScrollReveal>
      </ScrollReveal>
    </section>
  );
}
