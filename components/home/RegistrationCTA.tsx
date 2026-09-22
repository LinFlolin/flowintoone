import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function RegistrationCTA() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10" aria-labelledby="registration-heading">
      <ScrollReveal className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[2rem] bg-heather px-6 py-12 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sandstone">
            For creators, dreamers and doers
          </p>
          <h2
            id="registration-heading"
            className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl sm:leading-[1.08]"
          >
            Your ideas deserve a home.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Create your website, share your story and connect with a community that
            values what you do.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-sandstone px-7 text-sm font-semibold text-ink transition-colors hover:bg-[#f0e4d5] focus-visible:outline-2 focus-visible:outline-white"
          >
            Create your website <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="mt-10 text-center text-xl font-semibold leading-tight tracking-[-0.03em] text-white/85 sm:mt-0 sm:max-w-28 sm:text-left sm:text-2xl">
          Create.<br />Connect.<br />Grow.<br />Together.
        </p>
      </ScrollReveal>
    </section>
  );
}
