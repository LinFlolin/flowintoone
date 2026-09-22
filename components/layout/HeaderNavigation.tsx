"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/auth/actions";
import { HEADER_NAVIGATION } from "@/components/layout/headerConfig";

type HeaderNavigationProps = {
  dashboardMode?: boolean;
  user?: {
    name: string;
    storefrontHref: string | null;
  };
};

function MenuMark({ open }: { open: boolean }) {
  return (
    <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
      <span
        className={open ? "h-px w-full translate-y-[6px] rotate-45 bg-current transition-transform" : "h-px w-full bg-current transition-transform"}
      />
      <span className={open ? "h-px w-full bg-current opacity-0 transition-opacity" : "h-px w-full bg-current transition-opacity"} />
      <span
        className={open ? "h-px w-full -translate-y-[6px] -rotate-45 bg-current transition-transform" : "h-px w-full bg-current transition-transform"}
      />
    </span>
  );
}

export function HeaderNavigation({ user, dashboardMode = false }: HeaderNavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-heather/25 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-[1720px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:min-h-[88px] xl:px-10 2xl:px-12">
        <div className="flex min-w-0 items-center gap-5 lg:gap-7">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold tracking-[-0.04em] text-ink focus-visible:outline-2 lg:text-2xl"
            onClick={closeMenus}
          >
            flowintoone<span className="text-candy">.</span>
          </Link>
          <span className="hidden h-5 w-px shrink-0 bg-heather/25 md:block" aria-hidden="true" />
          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Main navigation">
            {HEADER_NAVIGATION.map((item) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-semibold text-ink/85 transition-colors hover:text-heather focus-visible:outline-2 lg:text-base"
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="cursor-default text-sm font-semibold text-ink/45" aria-disabled="true" title="Prossimamente">
                  {item.label}
                </span>
              )
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={user.storefrontHref || "/dashboard"}
                target={user.storefrontHref ? "_blank" : undefined}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-heather/30 px-4 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-visible:outline-2"
              >
                {user.storefrontHref ? "Vedi il mio sito ↗" : "Dashboard"}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex min-h-10 max-w-48 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink/90 transition-colors hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                  aria-expanded={isUserMenuOpen}
                  aria-controls="user-navigation"
                  aria-haspopup="menu"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                >
                  <span className="truncate">{user.name}</span>
                  <span className={isUserMenuOpen ? "rotate-180 text-xs transition-transform" : "text-xs transition-transform"} aria-hidden="true">
                    ▾
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div
                    id="user-navigation"
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-10 min-w-52 rounded-2xl border border-heather/25 bg-cream p-2 shadow-[0_14px_40px_rgba(81,68,91,0.14)]"
                  >
                    <Link
                      href="/dashboard/profile"
                      role="menuitem"
                      onClick={closeMenus}
                      className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                    >
                      Il mio profilo
                    </Link>
                    {user.storefrontHref && (
                      <Link
                        href={user.storefrontHref}
                        role="menuitem"
                        onClick={closeMenus}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                      >
                        Il mio sito
                      </Link>
                    )}
                    <form action={logoutAction} className="mt-1 border-t border-heather/15 pt-1">
                      <button
                        type="submit"
                        role="menuitem"
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                      >
                        Esci
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-ink transition-colors hover:text-heather focus-visible:outline-2"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
              >
                Crea il tuo sito
              </Link>
            </>
          )}
        </div>

        {!dashboardMode && <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-heather/30 text-ink md:hidden"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span className="sr-only">Menu</span>
          <MenuMark open={isMobileMenuOpen} />
        </button>}
      </div>

      {!dashboardMode && isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenus}
          className="fixed inset-0 z-[55] bg-ink/35 md:hidden"
        />
      )}
      {!dashboardMode && <div
        id="mobile-navigation"
        className={isMobileMenuOpen ? "fixed inset-y-0 left-0 z-[60] flex min-h-screen w-[min(22rem,90vw)] flex-col overflow-y-auto bg-cream px-5 pb-8 pt-5 shadow-[12px_0_36px_rgba(81,68,91,0.18)] md:hidden" : "hidden md:hidden"}
      >
        <div className="flex min-h-14 items-center justify-between border-b border-heather/15 pb-4">
          <Link href="/" onClick={closeMenus} className="text-xl font-bold tracking-[-0.04em] text-ink">
            flowintoone<span className="text-candy">.</span>
          </Link>
          <button type="button" onClick={closeMenus} aria-label="Close navigation menu" className="grid size-10 place-items-center rounded-full border border-heather/60 text-xl font-light text-ink">×</button>
        </div>
        <nav className="grid gap-1" aria-label="Mobile navigation">
            {HEADER_NAVIGATION.map((item) => (
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenus}
                className={`rounded-xl px-3 py-3 text-base font-semibold hover:bg-white/70 hover:text-heather focus-visible:outline-2 ${pathname === item.href ? "bg-heather/15 text-heather" : "text-ink/90"}`}
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className="rounded-xl px-3 py-3 text-base font-semibold text-ink/45" aria-disabled="true">
                {item.label} <span className="ml-1 text-xs font-medium">Prossimamente</span>
              </span>
            )
            ))}
        </nav>
        <div className="mt-4 grid gap-1 border-t border-heather/20 pt-4">
          {user ? (
            <>
              <div className="flex min-h-14 items-center gap-3 rounded-xl px-3">
                <span className="grid size-9 place-items-center rounded-full bg-candy/20 text-sm font-semibold text-heather">{user.name.charAt(0).toUpperCase()}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{user.name}</p><Link href="/dashboard/profile" onClick={closeMenus} className="text-xs text-ink/55">Vedi profilo</Link></div>
                <span className="text-base text-ink/55" aria-hidden="true">›</span>
              </div>
              <Link
                href="/dashboard"
                onClick={closeMenus}
                className="inline-flex min-h-11 items-center justify-between rounded-xl bg-heather px-4 text-sm font-semibold text-white focus-visible:outline-2"
              >
                <span className="flex items-center gap-3"><span className="text-base">▦</span>Dashboard</span><span aria-hidden="true">›</span>
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={closeMenus}
                className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
              >
                <span className="flex items-center gap-3"><span className="text-base">♙</span>Il mio profilo</span><span aria-hidden="true">›</span>
              </Link>
              {user.storefrontHref && (
                <Link
                  href={user.storefrontHref}
                  onClick={closeMenus}
                  className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                >
                  <span className="flex items-center gap-3"><span className="text-base">▱</span>Il mio sito</span><span aria-hidden="true">›</span>
                </Link>
              )}
              <form action={logoutAction} className="mt-2 border-t border-heather/15 pt-2">
                <button
                  type="submit"
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-ink/80 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                >
                  <span className="text-base">↪</span>Esci
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenus}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-heather/30 px-5 text-sm font-semibold text-ink focus-visible:outline-2"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-heather px-5 text-sm font-semibold text-white focus-visible:outline-2"
              >
                Crea il tuo sito
              </Link>
            </>
          )}
        </div>
        {user && <div className="mt-4 flex items-center gap-3 rounded-xl bg-candy/10 px-3 py-3 text-[10px] leading-4 text-ink/65"><span className="text-2xl text-candy" aria-hidden="true">◒</span><span>A kinder web<br />for creative people.</span></div>}
      </div>}
    </header>
  );
}
