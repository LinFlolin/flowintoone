import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/auth/actions";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { email } = await requireUser();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-heather/10 bg-white/65">
        <div className="mx-auto flex min-h-[76px] max-w-[1720px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 xl:px-10 2xl:px-12">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-xl font-bold tracking-[-0.04em] text-ink focus-visible:outline-2"
            >
              flowintoone<span className="text-candy">.</span>
            </Link>
            <span className="hidden h-5 w-px bg-heather/20 sm:block" aria-hidden="true" />
            <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-heather sm:block">
              Artisan dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {email && <span className="hidden text-xs text-ink/55 md:block">{email}</span>}
            <Link
              href="/dashboard/profile"
              className="hidden text-sm font-semibold text-ink/70 transition-colors hover:text-heather sm:block"
            >
              Profile
            </Link>
            <Link
              href="/"
              className="text-sm font-semibold text-ink/70 transition-colors hover:text-heather"
            >
              View website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="min-h-10 rounded-full border border-heather/25 px-4 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="px-6 py-8 sm:px-8 lg:px-10 2xl:px-12 mx-auto">
        <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)] 2xl:gap-8 2xl:grid-cols-[13rem_minmax(0,1fr)]">
          <DashboardSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
