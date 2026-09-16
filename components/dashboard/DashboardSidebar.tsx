"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { DASHBOARD_NAVIGATION } from "@/components/dashboard/dashboardConfig";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Dashboard navigation"
      className="scrollbar-hidden overflow-x-auto rounded-2xl border border-heather/25 bg-white/45 p-2 lg:min-h-[calc(100vh-8.5rem)] lg:overflow-visible"
    >
      <nav className="flex min-w-max gap-1 lg:sticky lg:top-6 lg:grid lg:min-w-0 lg:gap-2">
        {DASHBOARD_NAVIGATION.map((item) => {
          const isActive = item.href === pathname;
          const content = (
            <>
              <DashboardIcon name={item.icon} className="size-4 shrink-0" />
              <span>{item.label}</span>
              {!item.href && (
                <span className="ml-auto hidden text-[10px] font-bold uppercase tracking-[0.1em] text-ink/55 lg:inline">
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
      </nav>
    </aside>
  );
}
