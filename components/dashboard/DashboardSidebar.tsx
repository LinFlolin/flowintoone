"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/auth/actions";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { DASHBOARD_NAVIGATION } from "@/components/dashboard/dashboardConfig";

type DashboardSidebarProps = {
  role: "visitor" | "artisan";
  userName?: string;
};

export function DashboardSidebar({ role, userName = "My account" }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"menu" | "discover">("menu");
  const groups = ["Website", "Community", "Support"] as const;

  const visibleItems = DASHBOARD_NAVIGATION.filter((item) => role === "artisan" || !item.ownerOnly);

  return (
    <aside aria-label="Navigazione dashboard" className="relative h-0 border-0 bg-transparent p-0 lg:h-auto lg:min-h-[calc(100vh-8.5rem)] lg:rounded-2xl lg:border-0 lg:bg-transparent lg:p-0">
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open);
          setMobileView("menu");
        }}
        aria-expanded={isOpen}
        aria-controls="dashboard-mobile-drawer"
        aria-label={isOpen ? "Chiudi navigazione dashboard" : "Apri navigazione dashboard"}
        className="fixed right-4 top-4 z-[65] grid size-11 place-items-center rounded-xl border border-heather/25 bg-cream text-ink shadow-sm lg:hidden"
      >
        <span className="sr-only">Menu dashboard</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span className={isOpen ? "h-px w-full translate-y-2 rotate-45 bg-current transition-transform" : "h-px w-full bg-current transition-transform"} />
          <span className={isOpen ? "h-px w-full opacity-0 transition-opacity" : "h-px w-full bg-current transition-opacity"} />
          <span className={isOpen ? "h-px w-full -translate-y-2 -rotate-45 bg-current transition-transform" : "h-px w-full bg-current transition-transform"} />
        </span>
      </button>

      {isOpen && (
        <button type="button" aria-label="Chiudi navigazione dashboard" onClick={() => { setIsOpen(false); setMobileView("menu"); }} className="fixed inset-0 z-50 bg-ink/35 lg:hidden" />
      )}
      <div id="dashboard-mobile-drawer" className={`fixed inset-y-0 left-0 z-[55] w-[min(20rem,86vw)] overflow-y-auto bg-cream p-5 pt-24 shadow-[10px_0_35px_rgba(81,68,91,0.15)] transition-transform lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute inset-x-5 top-0 flex h-20 items-center justify-between border-b border-heather/15">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-bold tracking-[-0.04em] text-ink">flowintoone<span className="text-candy">.</span></Link>
          <button type="button" onClick={() => { setIsOpen(false); setMobileView("menu"); }} aria-label="Chiudi navigazione dashboard" className="grid size-9 place-items-center rounded-full border border-heather/60 text-xl font-light text-ink">×</button>
        </div>
        {mobileView === "menu" ? (
          <MobileDashboardMenu userName={userName} pathname={pathname} role={role} onDiscover={() => setMobileView("discover")} closeMenu={() => setIsOpen(false)} />
        ) : (
          <MobileDiscoverMenu queryHref="/discover" back={() => setMobileView("menu")} closeMenu={() => setIsOpen(false)} />
        )}
      </div>

      <nav className="hidden gap-4 px-1 pb-2 pt-2 lg:sticky lg:top-6 lg:grid">
        <DashboardNavItems items={visibleItems} pathname={pathname} groups={groups} />
      </nav>
    </aside>
  );
}

function MobileDashboardMenu({
  userName,
  pathname,
  role,
  onDiscover,
  closeMenu,
}: {
  userName: string;
  pathname: string;
  role: "visitor" | "artisan";
  onDiscover: () => void;
  closeMenu: () => void;
}) {
  const itemClass = (href: string) => `flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold ${pathname === href ? "bg-heather/15 text-heather" : "text-ink/80 hover:bg-heather/10"}`;
  return (
    <div className="pt-2">
      <div className="flex items-center gap-3 border-b border-heather/15 px-3 pb-4">
        <span className="grid size-9 place-items-center rounded-full bg-candy/20 text-sm font-semibold text-heather">{userName.charAt(0).toUpperCase()}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-ink">{userName}</p><Link href="/dashboard/profile" onClick={closeMenu} className="text-[10px] text-ink/55">Vedi profilo</Link></div>
        <span className="text-base text-ink/55" aria-hidden="true">›</span>
      </div>

      <div className="mt-3 grid gap-1">
        <Link href="/dashboard" onClick={closeMenu} className={itemClass("/dashboard")}><DashboardIcon name="home" className="size-4" />Home<span className="ml-auto text-base text-ink/55">›</span></Link>
        <button type="button" onClick={onDiscover} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold text-ink/80 hover:bg-heather/10"><DashboardIcon name="discover" className="size-4" />Scopri<span className="ml-auto text-base text-ink/55">›</span></button>
        <Link href="/events" onClick={closeMenu} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/80 hover:bg-heather/10"><DashboardIcon name="calendar" className="size-4" />Eventi<span className="ml-auto text-base text-ink/55">›</span></Link>
        <div className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/50"><DashboardIcon name="profile" className="size-4" />Chi siamo<span className="ml-auto rounded-full bg-heather/10 px-2 py-1 text-[9px] text-heather">Prossimamente</span></div>
      </div>

      <MobileMenuSection title="Il mio spazio">
        <Link href="/dashboard" onClick={closeMenu} className={itemClass("/dashboard")}><DashboardIcon name="home" className="size-4" />Dashboard<span className="ml-auto text-base text-ink/55">›</span></Link>
        {role === "artisan" && <Link href="/dashboard/storefront" onClick={closeMenu} className={itemClass("/dashboard/storefront")}><DashboardIcon name="storefront" className="size-4" />Il mio sito<span className="ml-auto text-base text-ink/55">›</span></Link>}
        <Link href="/dashboard/profile" onClick={closeMenu} className={itemClass("/dashboard/profile")}><DashboardIcon name="profile" className="size-4" />Il mio profilo<span className="ml-auto text-base text-ink/55">›</span></Link>
        {role === "artisan" && <div className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/50"><DashboardIcon name="settings" className="size-4" />Impostazioni<span className="ml-auto text-[9px] uppercase tracking-wide text-ink/40">Presto</span></div>}
      </MobileMenuSection>

      <MobileMenuSection title="Supporto">
        <div className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/70"><DashboardIcon name="help" className="size-4" />Aiuto e FAQ<span className="ml-auto text-base text-ink/55">›</span></div>
        <div className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/70"><span className="text-base">✉</span>Contattaci<span className="ml-auto text-[9px] uppercase tracking-wide text-ink/40">Presto</span></div>
        <form action={logoutAction}><button type="submit" className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold text-ink/70 hover:bg-heather/10"><span className="text-base">↪</span>Esci</button></form>
      </MobileMenuSection>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-candy/10 px-3 py-3 text-[10px] text-ink/65"><span className="text-2xl text-candy" aria-hidden="true">◒</span><span>Un web più gentile<br />per persone creative.</span></div>
    </div>
  );
}

function MobileDiscoverMenu({ queryHref, back, closeMenu }: { queryHref: string; back: () => void; closeMenu: () => void }) {
  const links = [
    { label: "Tutti i creator", href: queryHref, icon: "discover" as const },
    { label: "Per categoria", href: queryHref, icon: "storefront" as const },
    { label: "Per località", href: queryHref, icon: "discover" as const },
    { label: "Eventi", href: "/events", icon: "calendar" as const },
  ];
  return (
    <div className="pt-2">
      <button type="button" onClick={back} className="flex min-h-10 items-center gap-2 px-1 text-xs font-semibold text-ink/65">← <span>Torna al menu</span></button>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-ink">Scopri</h2>
      <div className="mt-3 grid gap-1">
        {links.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu} className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/80 hover:bg-heather/10"><DashboardIcon name={item.icon} className="size-4" />{item.label}<span className="ml-auto text-base text-ink/55">›</span></Link>)}
        <div className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-ink/50"><DashboardIcon name="bookmark" className="size-4" />Raccolte<span className="ml-auto text-[9px] uppercase tracking-wide text-ink/40">Presto</span></div>
      </div>
      <p className="mt-5 border-t border-heather/15 pt-4 text-xs font-semibold text-ink/75">Link rapidi</p>
      <div className="mt-2 grid gap-1">
        {[{ label: "Ceramics", image: "/Ceramics.png", slug: "ceramics" }, { label: "Jewelry", image: "/Jewelry.png", slug: "jewelry" }, { label: "Textiles", image: "/Textiles.png", slug: "textiles" }].map((item) => <Link key={item.label} href={`${queryHref}?category=${item.slug}`} onClick={closeMenu} className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-xs font-semibold text-ink/75 hover:bg-heather/10"><span className="relative size-9 overflow-hidden rounded-lg bg-sandstone/60"><Image src={item.image} alt="" fill sizes="36px" className="object-cover" /></span>{item.label}<span className="ml-auto text-base text-ink/55">›</span></Link>)}
      </div>
      <Link href="/discover" onClick={closeMenu} className="mt-4 flex items-center justify-between rounded-xl bg-heather/15 px-3 py-4 text-xs text-ink/75"><span><strong className="block text-sm text-ink">Scopri<br />qualcosa di speciale.</strong>Persone vere. Storie uniche.</span><span className="grid size-8 place-items-center rounded-full bg-heather text-white">→</span></Link>
    </div>
  );
}

function MobileMenuSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-4 border-t border-heather/15 pt-3"><p className="px-3 pb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-heather">{title}</p><div className="grid gap-1">{children}</div></section>;
}

function DashboardNavItems({
  items,
  pathname,
  groups,
  closeMenu,
}: {
  items: typeof DASHBOARD_NAVIGATION;
  pathname: string;
  groups: readonly ["Website", "Community", "Support"];
  closeMenu?: () => void;
}) {
  return (
    <>
      {groups.map((group) => (
        <div key={group} className="border-t border-heather/15 pt-3 first:border-t-0 first:pt-0">
          <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45">{{ Website: "Sito", Community: "Community", Support: "Supporto" }[group]}</p>
          <div className="grid gap-1">
        {items.filter((item) => item.group === group).map((item) => {
          const isActive = item.href === pathname;
          const content = (
            <>
              <DashboardIcon name={item.icon} className="size-4 shrink-0" />
              <span>{item.label}</span>
              {!item.href && (
                <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.1em] text-ink/40">Presto</span>
              )}
            </>
          );
          const isDiscover = item.href === "/discover";
          const className = `inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors ${isActive ? isDiscover ? "bg-viridian/15 text-viridian" : "bg-heather/15 text-heather" : item.href ? isDiscover ? "text-viridian/90 hover:bg-viridian/10 hover:text-viridian" : "text-ink/80 hover:bg-heather/10 hover:text-heather" : "cursor-default text-ink/55"}`;

          return item.href ? (
            <Link key={item.label} href={item.href} onClick={closeMenu} className={className} aria-current={isActive ? "page" : undefined}>{content}</Link>
          ) : (
            <div key={item.label} className={className} aria-disabled="true">{content}</div>
          );
        })}
          </div>
        </div>
      ))}
    </>
  );
}
