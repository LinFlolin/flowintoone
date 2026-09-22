"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";

type DashboardBottomNavProps = {
  role: "visitor" | "artisan";
};

const ownerItems = [
  { label: "Dashboard", href: "/dashboard", icon: "home" as const },
  { label: "Sito", href: "/dashboard/storefront", icon: "storefront" as const },
  { label: "Scopri", href: "/discover", icon: "discover" as const },
  { label: "Account", href: "/dashboard/profile", icon: "profile" as const },
];

const visitorItems = [
  { label: "Dashboard", href: "/dashboard", icon: "home" as const },
  { label: "Scopri", href: "/discover", icon: "discover" as const },
  { label: "Home", href: "/", icon: "storefront" as const },
  { label: "Account", href: "/dashboard/profile", icon: "profile" as const },
];

export function DashboardBottomNav({ role }: DashboardBottomNavProps) {
  const pathname = usePathname();
  const items = role === "artisan" ? ownerItems : visitorItems;

  return (
    <nav
      aria-label="Navigazione principale dashboard"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-heather/20 bg-cream/95 px-3 pt-2 shadow-[0_-8px_24px_rgba(81,68,91,0.08)] backdrop-blur-md [padding-bottom:env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors ${isActive ? "text-heather" : "text-ink/60 hover:text-heather"}`}
            >
              <DashboardIcon name={item.icon} className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
