"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/auth/actions";
import { HEADER_NAVIGATION } from "@/components/layout/headerConfig";

type HeaderNavigationProps = {
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

export function HeaderNavigation({ user }: HeaderNavigationProps) {
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
      <div className="mx-auto flex min-h-[76px] max-w-[1720px] items-center justify-between gap-4 px-5 py-4 sm:px-8 xl:px-10 2xl:px-12">
        <div className="flex min-w-0 items-center gap-5 lg:gap-7">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold tracking-[-0.04em] text-ink focus-visible:outline-2"
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
                  className="text-sm font-semibold text-ink/85 transition-colors hover:text-heather focus-visible:outline-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="cursor-default text-sm font-semibold text-ink/45" aria-disabled="true" title="Coming soon">
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
                {user.storefrontHref ? "View my website ↗" : "Dashboard"}
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
                      My profile
                    </Link>
                    {user.storefrontHref && (
                      <Link
                        href={user.storefrontHref}
                        role="menuitem"
                        onClick={closeMenus}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                      >
                        My website
                      </Link>
                    )}
                    <form action={logoutAction} className="mt-1 border-t border-heather/15 pt-1">
                      <button
                        type="submit"
                        role="menuitem"
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                      >
                        Logout
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
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
              >
                Create your storefront
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-heather/30 text-ink md:hidden"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span className="sr-only">Menu</span>
          <MenuMark open={isMobileMenuOpen} />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={isMobileMenuOpen ? "grid border-t border-heather/20 bg-cream px-5 pb-6 pt-4 md:hidden" : "hidden border-t border-heather/20 bg-cream px-5 pb-6 pt-4 md:hidden"}
      >
        <nav className="grid gap-1" aria-label="Mobile navigation">
            {HEADER_NAVIGATION.map((item) => (
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenus}
                className="rounded-xl px-3 py-3 text-base font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className="rounded-xl px-3 py-3 text-base font-semibold text-ink/45" aria-disabled="true">
                {item.label} <span className="ml-1 text-xs font-medium">Coming soon</span>
              </span>
            )
            ))}
        </nav>
        <div className="mt-4 grid gap-3 border-t border-heather/20 pt-5">
          {user ? (
            <>
              <p className="px-3 text-sm font-semibold text-ink/75">{user.name}</p>
              <Link
                href="/dashboard"
                onClick={closeMenus}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white focus-visible:outline-2"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={closeMenus}
                className="rounded-xl px-3 py-3 text-base font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
              >
                My profile
              </Link>
              {user.storefrontHref && (
                <Link
                  href={user.storefrontHref}
                  onClick={closeMenus}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                >
                  My website
                </Link>
              )}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-xl px-3 py-3 text-left text-base font-semibold text-ink/90 hover:bg-white/70 hover:text-heather focus-visible:outline-2"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenus}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-heather/30 px-5 text-sm font-semibold text-ink focus-visible:outline-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white focus-visible:outline-2"
              >
                Create your storefront
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
