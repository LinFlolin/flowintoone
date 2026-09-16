"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About us", href: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#877499]/10 bg-[#f8f4ef]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-[1.35rem] font-bold tracking-[-0.04em] text-ink focus-visible:outline-2"
          onClick={closeMenu}
        >
          flowintoone<span className="text-candy">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/75 transition-colors hover:text-heather focus-visible:outline-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-ink transition-colors hover:text-heather focus-visible:outline-2"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white transition-colors hover:bg-[#756486] focus-visible:outline-2"
          >
            Create your storefront
          </Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-heather/20 text-ink md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
            <span
              className={`h-px w-full bg-current transition-transform ${isOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-transform ${isOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`${isOpen ? "grid" : "hidden"} border-t border-heather/10 bg-cream px-5 pb-6 pt-4 md:hidden`}
      >
        <nav className="grid gap-1" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-white/70 focus-visible:outline-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 grid gap-3 border-t border-heather/10 pt-5">
          <Link
            href="/login"
            onClick={closeMenu}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-heather/30 px-5 text-sm font-semibold text-ink focus-visible:outline-2"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={closeMenu}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-heather px-5 text-sm font-semibold text-white focus-visible:outline-2"
          >
            Create your storefront
          </Link>
        </div>
      </div>
    </header>
  );
}
