import type { ReactNode } from "react";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Header } from "@/components/layout/Header";
import { getAccountRole } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { supabase, userId } = await requireUser();
  const accountRole = (await getAccountRole(supabase, userId)) ?? "visitor";
  const role = accountRole === "artisan" || accountRole === "organizer" ? accountRole : "visitor";
  const [{ data: profile }, { data: business }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    supabase.from("businesses").select("website_purpose").eq("owner_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle(),
  ]);
  const userName = profile?.full_name?.trim() || "My account";

  return (
    <div className="min-h-screen bg-cream">
      <Header dashboardMode />
      <main className="mx-auto min-w-0 px-3 pb-24 pt-4 sm:px-8 sm:py-8 lg:px-10 lg:pb-8 2xl:px-12">
        <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)] 2xl:gap-8 2xl:grid-cols-[14rem_minmax(0,1fr)]">
          <DashboardSidebar role={role} websitePurpose={business?.website_purpose ?? null} userName={userName} />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <DashboardBottomNav role={role} />
    </div>
  );
}
