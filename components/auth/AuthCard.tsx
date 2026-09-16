import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ eyebrow, title, description, children }: AuthCardProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12 sm:px-8">
      <div
        className="absolute -left-20 top-16 size-72 rounded-full bg-sandstone/45 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 bottom-10 size-64 rounded-full bg-viridian/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg">
        <Link
          href="/"
          className="mx-auto mb-8 block w-fit text-2xl font-bold tracking-[-0.04em] text-ink focus-visible:outline-2"
        >
          flowintoone<span className="text-candy">.</span>
        </Link>

        <div className="rounded-[2rem] border border-heather/15 bg-white/70 p-6 backdrop-blur-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-heather">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink/65">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
