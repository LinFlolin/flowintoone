import Link from "next/link";

export function RegistrationCTA() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10" aria-labelledby="registration-heading">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[2rem] bg-heather px-6 py-14 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sandstone">
          For independent artisans
        </p>
        <h2
          id="registration-heading"
          className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl sm:leading-[1.08]"
        >
          Your creativity deserves a place to bloom.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
          Create your digital storefront, share your story, and introduce your
          handmade creations to a wider community.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-sandstone px-7 text-sm font-semibold text-ink transition-colors hover:bg-[#f0e4d5] focus-visible:outline-2 focus-visible:outline-white"
        >
          Create your storefront
        </Link>
      </div>
    </section>
  );
}
