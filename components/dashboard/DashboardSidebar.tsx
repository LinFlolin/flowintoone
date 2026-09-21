"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { DASHBOARD_NAVIGATION } from "@/components/dashboard/dashboardConfig";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const groups = ["Website", "Community", "Support"] as const;

  return (
    <aside
      aria-label="Dashboard navigation"
      className="rounded-2xl border border-heather/20 bg-white/45 p-2 lg:min-h-[calc(100vh-8.5rem)] lg:border-0 lg:bg-transparent lg:p-0"
    >
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-semibold text-ink lg:hidden">
        <span>Dashboard menu</span><span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>
      <nav className={`${isOpen ? "grid" : "hidden"} gap-4 px-1 pb-2 pt-2 lg:sticky lg:top-6 lg:grid`}>
        {groups.map((group) => (
          <div key={group} className="border-t border-heather/15 pt-3 first:border-t-0 first:pt-0">
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45">{group}</p>
            <div className="grid gap-1">
        {DASHBOARD_NAVIGATION.filter((item) => item.group === group).map((item) => {
          const isActive = item.href === pathname;
          const content = (
            <>
              <DashboardIcon name={item.icon} className="size-4 shrink-0" />
              <span>{item.label}</span>
              {!item.href && (
                <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.1em] text-ink/40">
                  Soon
                </span>
              )}
            </>
          );
          const className = `inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors ${
            isActive
              ? "bg-heather/15 text-heather"
              : item.href
                ? "text-ink/80 hover:bg-heather/10 hover:text-heather"
                : "cursor-default text-ink/55"
          }`;

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className={className}
              aria-current={isActive ? "page" : undefined}
            >
              {content}
            </Link>
          ) : (
            <div key={item.label} className={className} aria-disabled="true">
              {content}
            </div>
          );
        })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
